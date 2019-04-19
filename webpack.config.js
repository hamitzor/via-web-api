/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

const path = require("path")
const nodeExternals = require("webpack-node-externals")

const clientCommonConfigs = {
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  devtool: "source-map",
  context: path.resolve(__dirname, "client-test-scripts"),
}

const searchTestScriptConfig = function (env, argv) {
  const mode = argv.mode
  return {
    mode: mode,
    ...clientCommonConfigs,
    entry: "./search-test-script.js",
    output: {
      path: path.resolve(__dirname, "lib"),
      filename: "search-test-script-bundle.js",
    }
  }
}

const serverConfig = function (env, argv) {
  const mode = argv.mode
  return {
    mode: mode,
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    },
    target: "node",
    devtool: "source-map",
    context: path.resolve(__dirname, "app"),
    entry: "./main.js",
    output: {
      path: path.resolve(__dirname, "lib"),
      filename: "start-app.js",
    },
    node: {
      __dirname: false
    },
    externals: [nodeExternals()]
  }
}


module.exports = [searchTestScriptConfig, serverConfig]