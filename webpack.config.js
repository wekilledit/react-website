const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const validate = require('webpack-validator');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  styles: path.join(__dirname, 'app', 'styles')
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    app: PATHS.app
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },

  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: PATHS.app
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: PATHS.styles
      },
      {
        test: /\.jsx?$/,
        // Enable caching for improved performance during development
        // It uses default OS directory by default. If you need something
        // more custom, pass a path to it. I.e., babel?cacheDirectory=<path>
        loaders: ['babel?cacheDirectory'],
        // Parse only app files! Without this it will go through entire project.
        // In addition to being slow, that will most likely result in an error.
        include: PATHS.app
      }
    ]
  }

};

var config;
switch(process.env.npm_lifecycle_event) {
  //** PRODUCTION ** //
  case 'build':
    config = merge(common, {
      devtool: 'cheap-module-source-map',
      // Unfortunately there's no way to only ignore third party libraries... it's
      // all or nothing. I may eventually  have my own warnings, but i'll take this
      // risk and try to remember to turn on these warnings occasionally. 
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: {warnings: false}
        }),
        // use prod node environment
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        })
      ]
    });
    break;
  // ** DEV ** //
  case 'start':
    config = merge(common, {
      devtool: 'eval-source-map',

      //more resource intensive but use it if watching stops working
      watchOptions: {
        poll: true
      },

      devServer: {
        contentBase: PATHS.build,

        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        historyApiFallback: true,
        hot: true,
        inline: true,
        

        // Display only errors to reduce the amount of output.
        stats: 'errors-only',

        // Parse host and port from env so this is easy to customize.
        //
        // If you use Vagrant or Cloud9, set
        // host: process.env.HOST || '0.0.0.0';
        //
        // 0.0.0.0 is available to all network devices unlike default
        // localhost
        host: process.env.HOST,
        port: process.env.PORT
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new NpmInstallPlugin({
          save: true //--save
        })
      ]
    });
    break;
  default:
    config = merge(common, {});
}

module.exports = validate(config);

