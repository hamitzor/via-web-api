/**
 * @fileoverview Socket server initializater for query by example service.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import SearchService from "../services/search-service"
import Logger from "../util/logger"
import config from "../../app.config"
import WebSocket from "ws"

class ESFSocketServerInitializer {
  constructor(port) {
    this._service = new SearchService({ api: true })
    this._logger = new Logger(config.log.directory.search, !config.log.enabled)
    this._wss = new WebSocket.Server({ port })
  }

  _onMessageHandler = async (webSocket, message) => {
    const data = JSON.parse(message)

    try {
      const videoId = data.videoId
      const options = { begin: data.begin, end: data.end }
      this._service.esf(videoId, options)

      //@TODO: implement real logic. get process percentage and inform client.
      let process = 0

      const interval = setInterval(() => {
        if (process > 100) {
          clearInterval(interval)
        }
        webSocket.send(JSON.stringify({
          status: true,
          process: process
        }), err => {
          process = process + 10
          if (err) {
            this._logger.error(err)
            webSocket.close()
          }
        })
      }, 1000)

    } catch (err) {
      this._logger.error(err)
      webSocket.send(JSON.stringify({
        status: false,
        message: "Internal Server Error"
      }), err => {
        if (err) {
          this._logger.error(err)
          webSocket.close()
        }
      })
    }
  }

  _onConnectionHandler = (webSocket) => {
    webSocket.on("message", message => {
      this._onMessageHandler(webSocket, message)
    })
  }

  attachHandlers = () => {
    this._wss.on("connection", (webSocket) => {
      this._onConnectionHandler(webSocket)
    })
  }
}

export default ESFSocketServerInitializer