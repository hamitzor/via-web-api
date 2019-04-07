import { exec } from "child_process"
import config from "../../../app.config"

class SearchService {
  constructor(commonOptions) {
    this.commonOptions = commonOptions ? commonOptions : {}
  }

  _stringifyOptions = (options) => {
    let str = ""
    options = { ...options, ...this.commonOptions }
    Object.keys(options).forEach((optionName) => {
      const optionValue = options[optionName]
      if (typeof optionValue === "boolean" && optionValue) {
        str = `${str} --${optionName}`
      }
      else {
        if (optionValue) {
          str = `${str} --${optionName} ${optionValue}`
        }
      }
    })
    return str
  }

  queryByExample = (videoId, exampleFile, options) => {
    return new Promise((resolve, reject) => {
      const command = `${config.commandPath.queryByExample} ${videoId} ${exampleFile} ${this._stringifyOptions(options)}`
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