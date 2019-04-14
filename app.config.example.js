import path from "path"


const searchModuleDirectory = "/home/via/via-project/search"

const config = {
  server: {
    domain: "http://localhost",
    port: 3000
  },
  socketPorts: {
    qbe: 8100,
    esf: 8101
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
      search: "/var/log/via/search"
    }
  },
  temporaryDirectory: "/tmp"
}

export default config