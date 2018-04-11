const fs = require('fs');
const { send } = require('micro');
const mime = require('mime');

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

module.exports = async (req, res) => {
  const [location, _query] = req.url.split('?');
  const pathComponents = decomposePathname(location);
  const shouldServePlayground = pathComponents[0] === 'playground';
  let file = `./build${req.url}`;

  fs.exists(file, exist => {
    if (!shouldServePlayground) {
      if (!exist) {
        send(res, 404);
        return;
      }

      if (fs.statSync(file).isDirectory()) {
        file += '/index.html';
      }
    } else {
      file = './build/playground.html';
    }

    fs.readFile(file, (err, data) => {
      if (err) {
        send(res, 500);
      } else {
        res.setHeader('Content-type', mime.getType(file));
        send(res, 200, data);
      }
    });
  });
};
