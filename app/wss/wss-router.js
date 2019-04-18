import WSSSearchController from "./wss-controllers/wss-search-controller"


class WSSRouter {
  constructor(logger) {
    this._logger = logger
    this._searchController = new WSSSearchController()
    this._routes = {
      ["start-qbe"]: this._searchController.startQBE,
      ["start-esf"]: this._searchController.startESF,
      ["watch-qbe"]: this._searchController.watchQBE,
      ["watch-esf"]: this._searchController.watchESF,
      ["update-esf-progress"]: this._searchController.updateESFProgress,
      ["update-qbe-progress"]: this._searchController.updateQBEProgress
    }
  }

  use = (route, data, ws, sharedData) => {
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
        requestedController(data, ws, sharedData)
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