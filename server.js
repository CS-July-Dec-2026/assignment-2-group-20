const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const publicDirectory = __dirname;
const userRecord = {
  displayName: 'Alex Morgan',
  isAdmin: false,
  creditLimit: 500
};

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Request body must be valid JSON'));
      }
    });
    request.on('error', reject);
  });
}

function serveFile(request, response) {
  const requestedPath = new URL(request.url, `http://${request.headers.host}`).pathname;
  const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.slice(1);
  const filePath = path.resolve(publicDirectory, relativePath);

  if (!filePath.startsWith(publicDirectory + path.sep)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    const contentType = contentTypes[path.extname(filePath)] || 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(file);
  });
}

const server = http.createServer(async (request, response) => {
  if (request.url === '/api/profile' && request.method === 'GET') {
    sendJson(response, 200, userRecord);
    return;
  }

  if (request.url === '/api/profile' && request.method === 'POST') {
    try {
      const requestBody = await readJson(request);
      Object.assign(userRecord, requestBody);
      sendJson(response, 200, userRecord);
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  if (request.method === 'GET') {
    serveFile(request, response);
    return;
  }

  response.writeHead(405);
  response.end('Method not allowed');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Mass assignment demo running at http://localhost:${port}`);
  console.log(`For another device, use this computer's IPv4 address on port ${port}.`);
});
