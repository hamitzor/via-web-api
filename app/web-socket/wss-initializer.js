/**
 * @fileoverview Socket server initializater for query by example service.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import SearchService from "../services/search-service"
import Logger from "../util/logger"
import config from "../../app.config"
import WebSocket from "ws"
import WSSRouter from "./wss-router"

class WSSInitializer {
  constructor(server) {
    this._service = new SearchService({ api: true })
    this._wss = new WebSocket.Server({ server })
    this._logger = new Logger(config.log.directory.wssInitializer, !config.log.enabled)
    const routerLogger = new Logger(config.log.directory.wssRouter, !config.log.enabled)
    this._router = new WSSRouter(routerLogger)
  }

  _sendError = (webSocket, errorMessage) => {
    webSocket.send(JSON.stringify({
      status: false,
      message: errorMessage
    }), err => {
      if (err) {
        this._logger.error(err)
        webSocket.close()
      }
    })
  }

  attachHandlers = () => {
    this._wss.on("connection", (webSocket) => {
      webSocket.on("message", message => {

        let messageObject = {}

        try {
          messageObject = JSON.parse(message)
        }
        catch (err) {
          this._sendError(webSocket, "Message should in JSON literal format")
        }

        const { route, data } = messageObject

        this._router.use(webSocket, route, data)
      })
    })
  }
}

export default WSSInitializer