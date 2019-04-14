import path from "path"


const searchModuleDirectory = "/home/via/via-project/search"

const config = {
  server: {
    domain: "http://localhost",
    port: 3000
  },
  database: {
    host: "localhost",
    username: "root",
    password: "root",
    name: "via"
  },
  commandPath: {
    queryByExample: `python ${path.resolve(searchModuleDirectory, "src/query-example.py")}`,
    extractFeature: `python ${path.resolve(searchModuleDirectory, "src/extract-feature.py")}`,
  },
  log: {
    enabled: true,
    directory: {
      search: "/var/log/via/search",
      wssRouter: "/var/log/via/wss-router",
      wssInitializer: "/var/log/via/wss-initializer",
      wssSearchController: "/var/log/via/wss-search"
    }
  },
  temporaryDirectory: "/tmp"
}

export default config