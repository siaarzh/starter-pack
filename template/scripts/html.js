const fs = require('fs');
const path = require('path');
const ReactDOMServer = require('react-dom/server');
const React = require('react');

import { Provider } from 'components-di';

function indent(str = '', level = 1) {
  const lines = str.split('\n');
  return lines.map(line => `${'  '.repeat(level)}${line}`).join('\n');
}

function template(meta = { title: 'STARTER-PACK' }, assets = { css: [], js: [], svg: '' }, content = '') {
  return `<!DOCTYPE html>
<html lang='en'>

<head>
  <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'>
  <meta name='language' content='EN'>

  <title>${meta.title}</title>
  ${assets.css.join('\n  ')}
</head>

<body>

  <div style='display:none;'>
    <svg>
${assets.svg}
    </svg>
  </div>

  <div id='mount-point'>${content}</div>

  <div id='portal-mount-point'></div>

  ${assets.js.join('\n  ')}
</body>

</html>`;
}

function css(href) {
  return `<link rel='stylesheet' media='screen' href='/assets/${href}'>`;
}

function js(src, embed = false) {
  if (embed) {
    return `<script type='text/javascript' charset='utf-8'>${src}</script>`;
  }
  return `<script type='text/javascript' src='/assets/${src}' charset='utf-8'></script>`;
}

const svg = indent(fs.readFileSync(path.join(__dirname, '..', 'src', 'assets', 'visuals', 'index.svg')).toString(), 3);
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'build', 'assets', 'manifest.json')).toString());
let runtime;
if (process.env.NODE_ENV === 'production') {
  const runtimeSrc = fs.readFileSync(path.join(__dirname, '..', 'build', 'assets', manifest.runtime.js)).toString();
  runtime = js(runtimeSrc, true);
} else {
  runtime = js(manifest.runtime.js);
}

// index.html:
fs.writeFileSync(
  path.join(__dirname, '..', 'build', 'pages', 'index.html'),
  template(
    { title: 'STARTER-PACK' },
    {
      svg,
      css: [css(manifest.main.css)],
      js: [runtime, js(manifest.vendor.js), js(manifest.main.js)],
    }
  )
);

// playground.html:
fs.writeFileSync(
  path.join(__dirname, '..', 'build', 'pages', 'playground.html'),
  template(
    { title: '>PL4YGR0UND 👾' },
    {
      svg,
      css: [css(manifest.playground.css)],
      js: [runtime, js(manifest.vendor.js), js(manifest.playground.js)],
    }
  )
);

const { router, session } = require('../src/main.js').default;

// patch session.render method to create a file
session.render = function render() {
  const content = ReactDOMServer.renderToStaticMarkup(
    <Provider value={{ deps: session.controller.provideDeps() }}>
      <session.controller.view />
    </Provider>
  );
  const file = session.context.store.state.pathname + '.html';
  fs.writeFileSync(
    path.join(__dirname, '..', 'build', 'pages', file),
    template(
      { title: 'STARTER-PACK' },
      {
        svg,
        css: [css(manifest.main.css)],
        js: [runtime, js(manifest.vendor.js), js(manifest.main.js)],
      },
      content
    )
  );
};

router.onLocationChange({ pathname: '/404', search: '' });
