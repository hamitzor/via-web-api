/**
 * @fileoverview Search WebSocket initializer class for initializing Search WebSocket instances
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import saveBase64Image from "../util/save-base64-image"
import SearchService from "../service/search-service"
import Logger from "../util/logger"
import config from "../../app.config"
import WebSocket from "ws"

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
      const resultJSONString = JSON.stringify({
        status: true,
        result
      })

      webSocket.send(resultJSONString,
        err => {
          if (err) { throw err }
        })

    } catch (err) {
      webSocket.close()
      this._logger.error(err)
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