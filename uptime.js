const request = require('request');

// Function to check server uptime
function checkServer() {
  request('http://localhost:3000', (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.log("Server is down");
    } else {
      console.log("Server is up");
    }
  });
}

// Check server every minute
setInterval(checkServer, 10000);
