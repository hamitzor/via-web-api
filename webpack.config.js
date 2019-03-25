const path = require('path')
const nodeExternals = require('webpack-node-externals')


module.exports = function (env, argv) {
  const mode = argv.mode
  const outputDirectory = mode === 'production' ? 'dist' : 'build'
  return {
    mode: mode,
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
      ]
    },
    target: 'node',
    devtool: 'source-map',
    context: path.resolve(__dirname, 'src'),
    entry: './main.js',
    output: {
      path: path.resolve(__dirname, outputDirectory),
      filename: 'start_app.js',
    },
    node: {
      __dirname: false
    },
    externals: [nodeExternals()]
  }
}
