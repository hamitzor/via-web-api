/**
 * @fileoverview A wrapper class for adding some useful methods to WebSocket.Server class from ws module. 
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import WebSocket from "ws"

class WebSocketServer extends WebSocket.Server {
  constructor(port) {
    super({ port })
  }

  onConnection = (callback) => {
    this.on("connection", (ws) => {
      ws.sendMessage = (message) => new Promise((resolve, reject) => {
        ws.send(message, (err) => {
          if (err)
            reject(err)
          else
            resolve()
        })
      })

      ws.sendData = async (data) => {
        await ws.sendMessage(JSON.stringify(data))
      }

      ws.onMessage = (callback) => {
        ws.on("message", callback)
      }

      callback(ws)
    })
  }
}

export default WebSocketServer