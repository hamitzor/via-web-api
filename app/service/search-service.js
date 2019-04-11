/**
 * @fileoverview Service class for handling system calls deal with search operations.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import { exec } from "child_process"
import config from "../../app.config"

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

  QBE = (videoId, exampleFile, options) => {
    return new Promise((resolve, reject) => {
      if (typeof videoId !== "number") {
        reject("videoId is not valid")
      }
      const stringifiedOptions = this._stringifyOptions({ ...options, ...this.commonOptions })
      const command = `${config.commandPath.queryByExample} ${videoId} ${exampleFile} ${stringifiedOptions}`
      exec(command, (err, stdout) => {
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