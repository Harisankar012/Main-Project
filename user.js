const request = require('request');

// Function to send requests to the server
function sendRequest() {
  // Make a request to the server
  request('http://localhost:3000', (error, response, body) => {
    if (error) {
      console.log('Error:', error);
    } else if (response.statusCode === 503) {
      console.log('The server is down');
    } else if (response.statusCode === 429) {
      console.log('Too Many Requests');
    } else {
      console.log('Response:', body);
    }
  });
}

// Send multiple requests to exceed the limit
const REQUEST_INTERVAL = 100; // 100 milliseconds
const REQUEST_COUNT = 110; // 110 requests to ensure we exceed the limit

for (let i = 0; i < REQUEST_COUNT; i++) {
  setTimeout(sendRequest, i * REQUEST_INTERVAL);
}
