const axios = require('axios');

function getRandomIp() {
  return Array(4).fill(0).map(() => Math.floor(Math.random() * 255)).join('.');
}

async function sendRequests() {
  const totalRequests = 1000;
  const serverUrl = 'http://localhost:3000';

  for (let i = 0; i < totalRequests; i++) {
    try {
      const ip = getRandomIp();
      const response = await axios.get(serverUrl, {
        headers: { 'x-forwarded-for': ip }
      });
      console.log(`Response from server: ${response.data}`);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

sendRequests();
