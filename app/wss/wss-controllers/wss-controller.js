/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../../util/logger"
import fetchConfig from "../../util/config-fetcher"

class WSSController {

  constructor() {
    this._logger = new Logger(fetchConfig("logging:directory:wss"), !fetchConfig("logging:enabled"))
  }

  _send = (ws, status, data = null) => {
    ws.send(JSON.stringify({
      status,
      data
    }), err => {
      if (err) {
        this._logger.error(err)
        ws.close()
      }
    })
  }

  _sendAndClose = (ws, status, data = null) => {
    ws.send(JSON.stringify({
      status,
      data
    }), err => {
      ws.close()
      if (err) {
        this._logger.error(err)
      }
    })
  }
}

export default WSSController