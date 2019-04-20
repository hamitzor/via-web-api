/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import defaultConfig from "../../app.config.default"
import userConfig from "../../app.config"

export default (configName) => {
  let configValue = userConfig[configName]
  if (!configValue) {
    configValue = defaultConfig[configName]
  }
  if (configValue === undefined) {
    throw Error(`No such configuration found : ${configName}`)
  }

  return configValue
}