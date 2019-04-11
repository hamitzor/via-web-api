/**
 * @fileoverview WebSocket initializer class for initializing WebSocket instances,
 * with some helper methods like log helpers.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../util/logger"
import config from "../../app.config"
import WebSocketServer from "./web-socket-server"


class WebSocketInitializer {
  constructor(port, webSocketName) {
    this.port = port
    this.name = webSocketName
    this._logger = new Logger(config.log.directory.search, !config.log.enabled)
    this.webSocketServer = new WebSocketServer(port)
  }

  _logEvent = (message, data) => {
    this._logger.info(`${message} -- data:${JSON.stringify({ webSocketName: this.name, ...data })}`)
  }

  logConnectionStarted = (data) => {
    this._logEvent(`Started WebSocket connection on port:${this.port}`, data)
  }

  logMessageReached = (data) => {
    this._logEvent(`Message reached on WebSocket on port:${this.port}`, data)
  }

  logMessageSent = (data) => {
    this._logEvent(`Message sent on Search WebSocket on port:${this.port}`, data)
  }

  logInfo = (message) => {
    this._logger.info(message)
  }

  logError = (err) => {
    this._logger.error(err)
  }
}

export default WebSocketInitializer