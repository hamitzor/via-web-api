/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../util/logger"
import getConfig from "../util/config-fetcher"
import WebSocket from "ws"
import WSSRouter from "./wss-router"

class WSS {
  constructor({ server, operationEE }) {
    this._wss = new WebSocket.Server({ server })
    this._logger = new Logger(getConfig("logging:directory:wss"), !getConfig("logging:enabled"))
    this._router = new WSSRouter(this._logger)
    this._operationEE = operationEE
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
    this._wss.on("connection", (ws) => {
      ws.on("message", message => {

        let messageObject = {}

        try {
          messageObject = JSON.parse(message)
        }
        catch (err) {
          this._sendError(ws, "Message should in JSON literal format")
        }

        const { route, data } = messageObject

        this._router.use(route, data, ws, this._operationEE)
      })
    })
  }
}

export default WSS