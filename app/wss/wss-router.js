/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import fetchConfig from "../util/config-fetcher"
import Logger from "../util/logger"
import routes from "./wss-routes"


class WSSRouter {
  constructor() {
    this._logger = new Logger(fetchConfig("logging:directory:wss"), !fetchConfig("logging:enabled"))
    this._routes = routes
  }

  use = (route, data, ws, operationEE) => {
    if (route !== "use") {
      const requestedController = this._routes[route]
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
        requestedController(data, ws, operationEE)
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

export default WSSRouter