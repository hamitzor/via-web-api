/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../util/logger"
import fetchConfig from "../util/config-fetcher"
import WebSocket from "ws"
import WSSRouter from "./wss-router"
import codes from "../util/status-codes"

class WSS extends WebSocket.Server {
  constructor({ server, operationEE }) {
    super({ server })
    this._logger = new Logger(fetchConfig("logging:directory:wss"), !fetchConfig("logging:enabled"))
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
    let obj = undefined

    try {
      obj = JSON.parse(message)
    }
    catch (err) {
      return undefined
    }

    if (obj === null || Array.isArray(obj) || typeof obj !== "object") {
      return undefined
    }

    return obj
  }

  attachEventHandlers = () => {
    this.on("connection", (ws) => {
      ws.on("message", message => {

        const messageObject = this._parseMessage(message)

        if (!messageObject) {
          this._sendAndClose(ws, codes.BAD_REQUEST, { message: "Message must be in JSON object format" })
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