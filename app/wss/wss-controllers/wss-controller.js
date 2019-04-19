/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../../util/logger"
import getConfig from "../../util/config-fetcher"

class WSSController {

  constructor() {
    this._logger = new Logger(getConfig("logging:directory:wss"), !getConfig("logging:enabled"))
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