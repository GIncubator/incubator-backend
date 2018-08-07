const path = require('path')
const NodemonPlugin = require('nodemon-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const Dotenv = require('dotenv-webpack')

const entry = path.resolve('./src/bin/www')

module.exports = {
  entry,
  output: {
    filename: 'bundle.js',
  },
  target: 'node',
  node: {
    __dirname: true,
    __filename: true,
  },
  externals: [nodeExternals()],
  devtool: 'source-map',
  watch: false,
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [['env', { targets: { node: 'v6.0.0' } }]],
        },
        include: __dirname,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new NodemonPlugin({
      watch: path.resolve('./dist'),
      ignore: ['*.js.map'],
      script: './dist/bundle.js',
      nodeArgs: [process.env.NODE_ENV === 'DEBUG' ? '--inspect-brk=9222' : ''],
    }),
    new Dotenv(),
  ],

  resolve: {
    alias: {
      routes: './src/routes',
    },
  },
}
