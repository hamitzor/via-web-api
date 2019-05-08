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

const queryTestScriptConfig = function (env, argv) {
  const mode = argv.mode
  return {
    mode: mode,
    ...clientCommonConfigs,
    entry: "./query-test-script.js",
    output: {
      path: path.resolve(__dirname, "lib"),
      filename: "query-test-script-bundle.js",
    }
  }
}
const anomalyTestScriptConfig = function (env, argv) {
  const mode = argv.mode
  return {
    mode: mode,
    ...clientCommonConfigs,
    entry: "./anomaly-test-script.js",
    output: {
      path: path.resolve(__dirname, "lib"),
      filename: "anomaly-test-script-bundle.js",
    }
  }

}
const activityTestScriptConfig = function (env, argv) {
  const mode = argv.mode
  return {
    mode: mode,
    ...clientCommonConfigs,
    entry: "./anomaly-activity-test-script.js",
    output: {
      path: path.resolve(__dirname, "lib"),
      filename: "anomaly-activity-test-script-bundle.js",
    }
  }

}
const objectTestScriptConfig = function (env, argv) {
  const mode = argv.mode
  return {
    mode: mode,
    ...clientCommonConfigs,
    entry: "./object-test-script.js",
    output: {
      path: path.resolve(__dirname, "lib"),
      filename: "object-test-script-bundle.js",
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


module.exports = [queryTestScriptConfig,anomalyTestScriptConfig,objectTestScriptConfig, serverConfig]