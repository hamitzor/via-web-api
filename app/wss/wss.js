/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../util/logger"
import getConfig from "../util/config-fetcher"
import WebSocket from "ws"
import WSSRouter from "./wss-router"
import codes from "../util/status-codes"

class WSS extends WebSocket.Server {
  constructor({ server, operationEE }) {
    super({ server })
    this._logger = new Logger(getConfig("logging:directory:wss"), !getConfig("logging:enabled"))
    this._router = new WSSRouter()
    this._operationEE = operationEE
  }

  _sendAndClose = (webSocket, status, data) => {
    webSocket.send(JSON.stringify({
      status,
      data
    }), err => {
      webSocket.close()
      if (err) {
        this._logger.error(err)
      }
    })
  }

  _parseMessage = (message) => {
    let messageObject = undefined

    try {
      messageObject = JSON.parse(message)
    }
    catch (err) {
      null
    }

    return messageObject
  }

  attachEventHandlers = () => {
    this.on("connection", (ws) => {
      ws.on("message", message => {

        const messageObject = this._parseMessage(message)

        if (!messageObject) {
          this._sendAndClose(ws, codes.BAD_REQUEST, { message: "Message must be in JSON literal format" })
        }
        else {
          const { route, data } = messageObject

          this._router.use(route, data, ws, this._operationEE)
        }
      })
    })
  }
}

export default WSS