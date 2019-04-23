/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import fetchConfig from "../util/config-fetcher"
import Logger from "../util/logger"
import routes from "./wss-routes"


class WSSRouter {
  constructor() {
    this._logger = new Logger(fetchConfig("logging:directory:wss"), !fetchConfig("logging:enabled"))
  }

  use = (route, data, ws) => {
    if (route !== "use") {
      const requestedController = routes[route]
      if (typeof requestedController !== "function") {
        ws.send(JSON.stringify({
          status: false,
          message: "route not found"
        }), err => {
          if (err) {
            this._logger.error(err)
            ws.close()
          }
        })
      }
      else {
        requestedController(data, ws)
      }
    }
    else {
      ws.send(JSON.stringify({
        status: false,
        message: "use route is restricted"
      }), err => {
        if (err) {
          this._logger.error(err)
          ws.close()
        }
      })
    }
  }
}

export default (new WSSRouter)