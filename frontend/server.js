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
    return res.end('Bad request');
  }

  let filePath = path.join(baseDir, pathname === '/' ? '/index.html' : pathname);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT' && !pathname.includes('.')) {
        // SPA Fallback: Return index.html
        fs.readFile(path.join(baseDir, 'index.html'), (err2, data2) => {
          if (err2) {
            res.statusCode = 500;
            return res.end('Server error: ' + err2.message);
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          return res.end(data2);
        });
        return;
      }
      res.statusCode = err.code === 'ENOENT' ? 404 : 500;
      return res.end('Not found: ' + pathname);
    }

    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
