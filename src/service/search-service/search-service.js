import { exec } from "child_process"
import config from "../../../app.config"

class SearchService {
  constructor(commonOptions) {
    this.commonOptions = commonOptions ? commonOptions : {}
  }

  _stringifyOptions = (options) => Object.keys(options).reduce((acc, optionName) => {
    const optionValue = options[optionName]
    if (typeof optionValue === "boolean" && optionValue) {
      acc = `${acc} --${optionName}`
    }
    else {
      if (optionValue) {
        acc = `${acc} --${optionName} ${optionValue}`
      }
    }
    return acc
  }, "")

  queryByExample = (videoId, exampleFile, options) => {
    return new Promise((resolve, reject) => {
      const command = `${config.commandPath.queryByExample} ${videoId} ${exampleFile} ${this._stringifyOptions({ ...options, ...this.commonOptions })}`
      exec(command, (err, stdout, _) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(JSON.parse(stdout))
        }
      })
    })
  }

}

export default SearchService