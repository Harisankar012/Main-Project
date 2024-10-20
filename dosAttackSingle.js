const axios = require('axios');

async function sendRequests() {
  const totalRequests = 60;
  const serverUrl = 'http://localhost:3000';
  const testIp = '192.168.0.1'; // Fixed IP for testing

  for (let i = 0; i < totalRequests; i++) {
    try {
      const response = await axios.get(serverUrl, {
        headers: { 'x-forwarded-for': testIp } // Use the same IP for rate-limiting test
      });
      console.log(`Response from server: ${response.data}`);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

sendRequests();
