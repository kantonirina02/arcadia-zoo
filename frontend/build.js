const fs = require('fs');
const path = require('path');

// Vercel build script to force static deployment
// This moves all static assets into a 'public' folder which Vercel detects automatically

fs.mkdirSync('public', { recursive: true });

// Copy directories
if (fs.existsSync('src')) fs.cpSync('src', 'public/src', { recursive: true });
if (fs.existsSync('assets')) fs.cpSync('assets', 'public/assets', { recursive: true });
if (fs.existsSync('pages')) fs.cpSync('pages', 'public/pages', { recursive: true });

// Copy files
if (fs.existsSync('index.html')) fs.copyFileSync('index.html', 'public/index.html');

console.log('Build complete. Files copied to public/ directory.');
