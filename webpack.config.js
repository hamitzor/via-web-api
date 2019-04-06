const path = require("path")
const nodeExternals = require("webpack-node-externals")


const clientConfig = function (env, argv) {
  const mode = argv.mode
  const outputDirectory = mode === "production" ? "dist" : "build"
  return {
    mode: mode,
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    },
    devtool: "source-map",
    context: path.resolve(__dirname, "src"),
    entry: "./client-test-main.js",
    output: {
      path: path.resolve(__dirname, outputDirectory),
      filename: "client-test-bundle.js",
      publicPath: "/"
    }
  }
}

const serverConfig = function (env, argv) {
  const mode = argv.mode
  const outputDirectory = mode === "production" ? "dist" : "build"
  return {
    mode: mode,
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    },
    target: "node",
    devtool: "source-map",
    context: path.resolve(__dirname, "src"),
    entry: "./main.js",
    output: {
      path: path.resolve(__dirname, outputDirectory),
      filename: "start-app.js",
    },
    node: {
      __dirname: false
    },
    externals: [nodeExternals()]
  }
}


module.exports = [clientConfig, serverConfig]