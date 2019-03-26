import path from "path"


const searchModuleDirectory = ""

const config = {
  server: {
    domain: "http://localhost",
    port: 3000
  },
  commandPath: {
    queryByExample: `python ${path.resolve(searchModuleDirectory, "src/query_example.py")}`,
    extractFeature: `python ${path.resolve(searchModuleDirectory, "src/extract_feature.py")}`,
  },
  log: {
    enabled: true,
    directory: {
      search: "/var/log/via/search"
    }
  }
}



export default config