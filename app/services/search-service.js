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
      if (optionValue) {
        acc = `${acc} --${optionName} ${optionValue}`
      }
    }
    return acc
  }, "")


  queryByExample = (videoId, exampleFile, options) => {
    return new Promise((resolve, reject) => {
      const stringifiedOptions = this._stringifyOptions({ ...options, ...this._commonOptions })
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

  extractSearchFeatures = (videoId, options) => {
    return new Promise((resolve, reject) => {
      const stringifiedOptions = this._stringifyOptions({ ...options, ...this._commonOptions })
      const command = `${config.commandPath.extractFeature} ${videoId} ${stringifiedOptions}`
      exec(command, (err) => {
        if (err) {
          reject(err)
        }
        else {
          resolve()
        }
      })
    })
  }

}

export default SearchService