const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = process.env.PORT || 3000;
const baseDir = path.join(__dirname);

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(baseDir, pathname);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = err.code === 'ENOENT' ? 404 : 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end(err.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
});
