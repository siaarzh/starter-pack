const path = require('path');
const webpack = require('webpack');
const pkg = require('../package.json');

const mode = process.env.WEBPACK_MODE || 'development';
const appVersion = pkg.version;
const filename = '[name]';

const options = {
  mode,
  target: 'node',
  node: {
    __filename: false,
    __dirname: false,
  },
  entry: {
    html: path.resolve(__dirname, 'html.js'),
  },
  output: {
    path: path.resolve(__dirname, '..', '.temp'),
    filename: `${filename}.js`,
  },
  resolve: {
    modules: [path.resolve(__dirname, '..', 'node_modules'), path.resolve(__dirname, '..', 'packages')],
    alias: {
      assets: path.resolve(__dirname, '..', 'src', 'assets'),
      components: path.resolve(__dirname, '..', 'src', 'ui', 'components'),
      views: path.resolve(__dirname, '..', 'src', 'ui', 'views'),
      controllers: path.resolve(__dirname, '..', 'src', 'controllers'),
      services: path.resolve(__dirname, '..', 'src', 'services'),
      utils: path.resolve(__dirname, '..', 'src', 'utils'),
      playground: path.resolve(__dirname, '..', 'src', 'playground'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname),
          path.resolve(__dirname, '..', 'src'),
          path.resolve(__dirname, '..', 'packages'),
        ],
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          emitFile: false,
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[hash:hex:8]__[local]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-smart-import')({
                  addDependencyTo: webpack,
                  root: path.resolve(__dirname),
                  path: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src')],
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
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        VERSION: JSON.stringify(appVersion),
        TARGET: JSON.stringify('node'),
      },
    }),
  ],
};

module.exports = options;
