/**
 * @fileoverview Socket server initializater for query by example service.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../../util/logger"
import getConfig from "../../util/config-fetcher"

class WSSController {

  constructor() {
    this._logger = new Logger(getConfig("logging:directory:wss"), !getConfig("logging:enabled"))
  }

  _sendError = (ws, errorMessage) => {
    ws.send(JSON.stringify({
      status: false,
      message: errorMessage
    }), err => {
      if (err) {
        this._logger.error(err)
        ws.close()
      }
    })
  }

  _sendData = (ws, data) => {
    ws.send(JSON.stringify({
      status: true,
      data
    }), err => {
      if (err) {
        this._logger.error(err)
        ws.close()
      }
    })
  }
}

export default WSSController