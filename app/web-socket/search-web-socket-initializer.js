/**
 * @fileoverview Search WebSocket initializer class for initializing Search WebSocket instances
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import saveBase64Image from '../util/save-base64-image'
import SearchService from '../service/search-service'
import WebSocketInitializer from './web-socket-initializer'


class SearchWebSocketInitializer extends WebSocketInitializer {
  constructor(port) {
    super(port, "QBE")
    this._service = new SearchService({ api: true })
  }

  _onMessageHandler = async (webSocket, message) => {
    const data = JSON.parse(message)
    this.logMessageReached({ videoId: data.videoId })

    try {
      const exampleFile = await saveBase64Image(data.base64Image)
      const options = { min: data.min, begin: data.begin, end: data.end }

      const result = await this._service.QBE(data.videoId, exampleFile, options)

      await webSocket.sendData({
        status: true,
        result
      })

    } catch (err) {
      webSocket.close()
      this.logError(err)
    }
  }

  _onConnectionHandler = (webSocket) => {
    this.logConnectionStarted()
    webSocket.onMessage(message => {
      this._onMessageHandler(webSocket, message)
    })
  }

  attachHandlers = () => {
    this.webSocketServer.onConnection((webSocket) => {
      this._onConnectionHandler(webSocket)
    })
  }
}

export default SearchWebSocketInitializer