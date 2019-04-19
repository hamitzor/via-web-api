import WSSSearchController from "./wss-controllers/wss-search-controller"


class WSSRouter {
  constructor(logger) {
    this._logger = logger
    this._searchController = new WSSSearchController()
    this._routes = {
      ["start-qbe"]: this._searchController.startQBE,
      ["watch-qbe"]: this._searchController.watchQBE,
      ["progress-qbe"]: this._searchController.progressQBE
    }
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