/**
 * @fileoverview Socket server initializater for query by example service.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import SearchService from "../services/search-service"
import Logger from "../util/logger"
import config from "../../app.config"
import WebSocket from "ws"

class ESFSocketServerInitializer {
  constructor(server) {
    this._service = new SearchService({ api: true })
    this._logger = new Logger(config.log.directory.search, !config.log.enabled)
    this._wss = new WebSocket.Server({ server, path: "/search/esf" })
  }

  _onMessageHandler = async (webSocket, message) => {
    const data = JSON.parse(message)

    try {
      const videoId = data.videoId
      const options = { begin: data.begin, end: data.end }
      const result = await this._service.extractFeatures(videoId, options)

      webSocket.send(JSON.stringify({
        status: true,
        result
      }), err => {
        if (err) {
          this._logger.error(err)
          webSocket.close()
        }
      })
    } catch (err) {
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