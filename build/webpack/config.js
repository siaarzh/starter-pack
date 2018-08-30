const path = require('path');
const webpack = require('webpack');
const ExtractCSSPlugin = require('./ExtractCSSPlugin');
const ExtractStatsPlugin = require('./ExtractStatsPlugin');
const getLocalIdent = require('css-loader/lib/getLocalIdent');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { version } = require('../../package.json');

function optimizationConfig({ isServer }) {
  if (isServer) {
    return {
      splitChunks: false,
      minimize: false,
    };
  }
  return {
    splitChunks: {
      cacheGroups: {
        // put all node modules into vendor chunk
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: /node_modules/,
          enforce: true,
        },
      },
    },
  };
}

function babelConfig({ isServer }) {
  let modules = false;
  if (isServer) {
    modules = 'commonjs';
  }
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          debug: false,
          targets: {
            browsers: ['>0.25%', 'not ie 11', 'not op_mini all'],
          },
          modules,
          loose: true,
        },
      ],
      '@babel/preset-react',
    ],
    env: {
      test: {
        presets: [['@babel/preset-env'], '@babel/preset-react'],
      },
    },
    plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-syntax-dynamic-import'],
  };
}

function outputConfig({ isServer, distDir, filename }) {
  if (isServer) {
    return {
      path: path.resolve(distDir, 'node'),
      filename: `${filename}.js`,
      publicPath: '/assets/',
      libraryTarget: 'commonjs2',
    };
  }
  return {
    path: path.resolve(distDir, 'assets'),
    filename: `${filename}.js`,
    publicPath: '/assets/',
  };
}

module.exports = function getConfig({ isServer = false, watch = false, production = false } = {}) {
  let mode = 'development';
  if (production) {
    mode = 'production';
  }

  let target = 'web';
  if (isServer) {
    target = 'node';
  }

  let filename = '[name]';
  if (mode === 'production' && isServer === false) {
    filename = '[name].[chunkhash]';
  }

  const rootDir = path.resolve(__dirname, '..', '..');
  const distDir = path.resolve(rootDir, 'dist');

  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
      },
      USE_LOG: JSON.stringify(true),
      APP_VERSION: JSON.stringify(version),
      IS_SERVER: JSON.stringify(isServer),
      IS_BROWSER: JSON.stringify(!isServer),
    }),
    new ExtractCSSPlugin({
      filename: `${filename}.css`,
      isServer,
    }),
    new ExtractStatsPlugin(),
    new FriendlyErrorsWebpackPlugin({ clearConsole: false }),
  ];

  const config = {
    mode,
    target,
    entry: {
      main: path.resolve(rootDir, 'src', 'main.js'),
    },
    output: outputConfig({ isServer, distDir, filename }),
    optimization: optimizationConfig({ isServer }),
    watch,
    watchOptions: {
      aggregateTimeout: 300,
    },
    resolve: {
      modules: [path.resolve(rootDir, 'node_modules'), path.resolve(rootDir, 'external_modules')],
      alias: {
        assets: path.resolve(rootDir, 'src', 'assets'),
        components: path.resolve(rootDir, 'src', 'ui', 'components'),
        views: path.resolve(rootDir, 'src', 'ui', 'views'),
        controllers: path.resolve(rootDir, 'src', 'controllers'),
        services: path.resolve(rootDir, 'src', 'services'),
        utils: path.resolve(rootDir, 'src', 'utils'),
        playground: path.resolve(rootDir, 'src', 'playground'),
        main: path.resolve(rootDir, 'src', 'main'),
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [path.resolve(rootDir, 'src'), path.resolve(rootDir, 'external_modules')],
          loader: 'babel-loader',
          options: babelConfig({ isServer }),
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: require.resolve('./extractCSSLoader'),
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[hash:8]__[local]',
                getLocalIdent: (context, localIdentName, localName, options) => {
                  let name = getLocalIdent(context, localIdentName, localName, options);
                  // Make sure classname doesn't start with underscore
                  // if it starts with underscore, than it was padded
                  if (name.startsWith('_')) {
                    name = 'a' + name.slice(2);
                  }
                  return name;
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('postcss-smart-import')({
                    addDependencyTo: webpack,
                    root: path.resolve(rootDir),
                    path: [path.resolve(rootDir, 'node_modules'), path.resolve(rootDir, 'src')],
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
    plugins,
  };
  return config;
};
