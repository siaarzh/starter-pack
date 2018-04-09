const path = require('path');
const webpack = require('webpack');
const CssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('./package.json');

const mode = process.env.WEBPACK_MODE || 'development';
const appVersion = pkg.version;
const filename = mode === 'development' ? '[name]' : '[name].[chunkhash]';

function ExtractManifestPlugin() {}
ExtractManifestPlugin.prototype.apply = function applyExtractManifestPlugin(compiler) {
  compiler.hooks.done.tap('ExtractManifestPlugin', function onDone(stats) {
    const assetsByChunkName = stats.toJson({
      hash: false,
      publicPath: false,
      assets: true,
      chunks: false,
      modules: false,
      source: false,
      errorDetails: false,
      timings: false,
      children: false,
    }).assetsByChunkName;
    const manifest = Object.keys(assetsByChunkName).reduce(function reducer(accum, chunkName) {
      if (Array.isArray(assetsByChunkName[chunkName])) {
        accum[chunkName] = {};
        for (const chunk of assetsByChunkName[chunkName]) {
          accum[chunkName][chunk.split('.').pop()] = chunk;
        }
      } else {
        const extension = assetsByChunkName[chunkName].split('.').pop();
        accum[chunkName] = { [extension]: assetsByChunkName[chunkName] };
      }
      return accum;
    }, {});
    require('fs').writeFileSync(path.join(__dirname, 'build', 'assets', 'manifest.json'), JSON.stringify(manifest));
  });
};

const postcssOptions = {
  config: {
    path: path.resolve(__dirname, 'postcss.config.js'),
  },
};

const options = {
  mode,
  entry: {
    main: path.resolve(__dirname, 'src', 'main.js'),
    playground: path.resolve(__dirname, 'src', 'playground', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'build', 'assets'),
    filename: `${filename}.js`,
    chunkFilename: `${filename}.js`,
    publicPath: '/assets/',
  },
  optimization: {
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
    runtimeChunk: {
      name: 'runtime',
    },
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'packages')],
    alias: {
      assets: path.resolve(__dirname, 'src', 'assets'),
      components: path.resolve(__dirname, 'src', 'ui', 'components'),
      views: path.resolve(__dirname, 'src', 'ui', 'views'),
      controllers: path.resolve(__dirname, 'src', 'controllers'),
      services: path.resolve(__dirname, 'src', 'services'),
      utils: path.resolve(__dirname, 'src', 'utils'),
      playground: path.resolve(__dirname, 'src', 'playground'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'packages')],
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          CssExtractPlugin.loader,
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
            options: postcssOptions,
          },
        ],
      },
    ],
  },
  plugins: [
    new CssExtractPlugin({
      filename: `${filename}.css`,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        VERSION: JSON.stringify(appVersion),
      },
    }),
    new ExtractManifestPlugin(),
  ],
  watchOptions: {
    aggregateTimeout: 100,
  },
};

module.exports = options;
