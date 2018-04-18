const micro = require('micro');
const compress = require('micro-compress');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const path = require('path');
const mime = require('mime');

const { parse } = require('url');

function decomposePathname(pathname) {
  let uri = decodeURIComponent(pathname);
  if (uri[0] === '/') {
    uri = uri.substr(1);
  }
  if (uri[uri.length - 1] === '/') {
    uri = uri.slice(0, -1);
  }
  return uri.split('/');
}

async function handler(req, res) {
  const { pathname } = parse(req.url);

  const pathComponents = decomposePathname(pathname);
  // if trying to access /playground/... respond with ./pages/playground.html
  if (pathComponents[0] === 'playground') {
    let data;
    const file = path.join(__dirname, '..', 'pages', 'playground.html');
    try {
      data = await readFile(file);
    } catch (err) {
      micro.send(res, 500);
      return;
    }
    res.setHeader('Content-Type', mime.getType(file));
    micro.send(res, 200, data);
  } else if (pathComponents[0] === 'assets' || mime.getType(pathname) !== null) {
    // serving assets
    let data;
    let file = path.join(__dirname, '..', ...pathComponents);
    try {
      data = await readFile(file);
    } catch (err) {
      micro.send(res, 404);
      return;
    }
    res.setHeader('Content-Type', mime.getType(file));
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    micro.send(res, 200, data);
  } else {
    let data;
    const fallback = path.join(__dirname, '..', 'pages', 'index.html');
    const file = path.join(__dirname, '..', 'pages', ...pathComponents) + '.html';
    try {
      data = await readFile(file);
    } catch (_err) {
      try {
        data = await readFile(fallback);
      } catch (err) {
        micro.send(res, 500);
        return;
      }
    }
    res.setHeader('Content-Type', mime.getType(file));
    micro.send(res, 200, data);
  }
}

module.exports = compress(handler);
