/**
 * @fileoverview Service class for handling system calls deal with search operations.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import { exec } from "child_process"
import config from "../../app.config"

class SearchService {
  constructor(commonOptions) {
    this._commonOptions = commonOptions ? commonOptions : {}
    this._commonOptions["db-host"] = config.database.host
    this._commonOptions["db-username"] = config.database.username
    this._commonOptions["db-password"] = config.database.password
    this._commonOptions["db-name"] = config.database.name
  }

  _stringifyOptions = (options) => Object.keys(options).reduce((acc, optionName) => {
    const optionValue = options[optionName]
    if (typeof optionValue === "boolean" && optionValue) {
      acc = `${acc} --${optionName}`
    }
    else {
      if (optionValue && optionValue !== "NaN") {
        acc = `${acc} --${optionName} ${optionValue}`
      }
    }
    return acc
  }, "")


  queryByExample = (videoId, exampleFilePath, options) => {
    return new Promise((resolve, reject) => {
      const stringifiedOptions = this._stringifyOptions({ ...options, ...this._commonOptions })
      const command = `${config.commandPath.queryByExample} ${videoId} ${exampleFilePath} ${stringifiedOptions}`
      exec(command, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        }
        else {
          if (stderr) {
            reject(stderr)
          }
          else {
            resolve(JSON.parse(stdout))
          }
        }
      })
    })
  }

  extractSearchFeatures = (videoId, options) => {
    return new Promise((resolve, reject) => {
      const stringifiedOptions = this._stringifyOptions({ ...options, ...this._commonOptions })
      const command = `${config.commandPath.extractFeature} ${videoId} ${stringifiedOptions}`
      exec(command, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        }
        else {
          if (stderr) {
            reject(stderr)
          }
          else {
            resolve()
          }
        }
      })
    })
  }

}

export default SearchService