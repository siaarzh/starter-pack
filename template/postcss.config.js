const { resolve } = require('path');

module.exports = {
  plugins: [
    require('postcss-smart-import')({
      root: resolve(__dirname),
      path: [resolve(__dirname, 'node_modules'), resolve(__dirname, 'modules')],
    }),
    require('postcss-custom-media')({}),
    require('postcss-custom-properties')({ preserve: false }),
    require('postcss-calc')({}),
    require('postcss-color-function')({}),
    require('postcss-discard-comments')({}),
    require('postcss-remove-root')({}),
    require('autoprefixer')({
      browsers: ['last 2 versions'],
    }),
    require('postcss-clean')({}),
  ],
};
