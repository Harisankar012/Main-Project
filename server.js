const express = require('express');
const redis = require('redis'); // Import Redis
const app = express();

const requestCounts = {};
const MAX_REQUESTS = 50;
const WINDOW_SIZE_IN_MINUTES = 10;
const WINDOW_SIZE_IN_MILLISECONDS = WINDOW_SIZE_IN_MINUTES * 60 * 1000;
let server;
let isServerDown = false;
let shutdownTimeout;

// Connect to Redis
const redisClient = redis.createClient({
  url: 'redis://localhost:6379' // Update with your Redis URL or host
});

redisClient.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

// Async function to connect to Redis
(async () => {
  await redisClient.connect(); // Use connect() with newer redis versions
})();

app.use(async (req, res, next) => {
  if (isServerDown) {
    res.status(503).send('Server is down');
    return;
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, firstRequestTime: Date.now() };
  } else {
    const currentTime = Date.now();
    if (currentTime - requestCounts[ip].firstRequestTime > WINDOW_SIZE_IN_MILLISECONDS) {
      requestCounts[ip] = { count: 1, firstRequestTime: currentTime };
    } else {
      requestCounts[ip].count += 1;
      if (requestCounts[ip].count > MAX_REQUESTS) {
        console.log(`Request limit of ${MAX_REQUESTS} requests per ${WINDOW_SIZE_IN_MINUTES} minutes exceeded by IP ${ip}`);
        res.status(429).send('Too Many Requests');
        
        if (!isServerDown) {
          isServerDown = true;
          shutdownTimeout = setTimeout(() => {
            server.close(() => {
              console.log('Server is shut down.');
            });
          }, 10000);
        }
        return;
      }
    }
  }

  // Store IP in Redis using SADD (set add)
  try {
    await redisClient.sAdd('ip_addresses', ip); // Use sAdd in place of sadd
  } catch (err) {
    console.error('Error storing IP in Redis:', err);
  }

  next();
});

app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`Request from IP: ${ip}`);
  next();
});

// Route to handle incoming requests
app.get('/', (req, res) => {
  res.send('Hello from server!');
});

// Endpoint to view stored IPs
app.get('/ips', async (req, res) => {
  try {
    const ips = await redisClient.sMembers('ip_addresses'); // Use sMembers to fetch all IPs
    res.status(200).json({ storedIPs: ips });
  } catch (err) {
    res.status(500).send('Error fetching IP addresses from Redis');
  }
});

// Endpoint to clear IPs
app.delete('/ips', async (req, res) => {
  try {
    await redisClient.del('ip_addresses'); // Delete the 'ip_addresses' key
    res.status(200).send('IP addresses cleared from Redis');
  } catch (err) {
    res.status(500).send('Error clearing IP addresses from Redis');
  }
});



const PORT = 3000;
server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
