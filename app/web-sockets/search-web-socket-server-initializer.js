/**
 * @fileoverview Search WebSocket initializer class for initializing Search WebSocket instances
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import saveBase64Image from "../util/save-base64-image"
import SearchService from "../services/search-service"
import Logger from "../util/logger"
import config from "../../app.config"
import WebSocket from "ws"
import WebSocketCannotSendMessageError from "../errors/web-socket-cannot-send-message-error"

class SearchWebSocketServerInitializer {
  constructor(server) {
    this._service = new SearchService({ api: true })
    this._logger = new Logger(config.log.directory.search, !config.log.enabled)
    this._wss = new WebSocket.Server({ server })
  }

  _onMessageHandler = async (webSocket, message) => {
    const data = JSON.parse(message)

    try {
      const videoId = data.videoId
      const exampleImageFilepath = await saveBase64Image(data.base64Image)
      const options = { min: data.min, begin: data.begin, end: data.end }
      const result = await this._service.QBE(videoId, exampleImageFilepath, options)

      webSocket.send(JSON.stringify({
        status: true,
        result
      }), err => {
        if (err) {
          throw new WebSocketCannotSendMessageError(err.message)
        }
      })
    } catch (err) {
      if (err instanceof WebSocketCannotSendMessageError) {
        this._logger.error(err)
        webSocket.close()
      }
      else {
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

export default SearchWebSocketServerInitializer