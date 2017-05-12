const path = require('path')
const glob = require('glob')

module.exports = {
  entry: glob.sync(path.resolve(__dirname, '../test/**/*.spec.ts')),
  output: {
    path: path.resolve(__dirname, '../.tmp'),
    filename: 'test.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'webpack-espower-loader!ts-loader' }
    ]
  },
  devtool: 'source-map'
}
