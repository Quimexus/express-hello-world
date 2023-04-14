const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        console.log(`Error reading file: ${err}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('File not found');
        res.end();
      } else {
        console.log(`Sending index.html file`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
      }
    });
  } else if (req.url === '/getRandomImage') {
    console.log(`Sending request to Danbooru API`);
    axios.get('https://danbooru.donmai.us/posts/random.json?tags=date:>=2016-01-01+score:>=20')
      .then(response => {
        console.log(`Received response from Danbooru API`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(response.data));
        res.end();
      })
      .catch(error => {
        console.log(`Error while fetching data from Danbooru API: ${error}`);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write('An error occurred');
        res.end();
      });
  } else {
    console.log(`Invalid request for ${req.url}`);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('File not found');
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
