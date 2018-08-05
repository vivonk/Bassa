var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./webpack.index.js",
  output: {
    path: __dirname + "/dist",
    filename: "index.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new HtmlWebpackPlugin({
    hash: true, // caching previous build
    template: './src/index.html',
    filename: './src/index.html' //relative to root of the application
    })
  ],
  module:{unknownContextCritical: false},
};
