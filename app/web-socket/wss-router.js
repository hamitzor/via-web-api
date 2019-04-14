import WSSSearchController from "./wss-controllers/wss-search-controller"


class WSSRouter {
  constructor(logger) {
    this._logger = logger
    this._searchController = new WSSSearchController()
    this._routes = {
      ["watch-query-by-example"]: this._searchController.watchQueryByExample,
      ["watch-extract-search-features"]: this._searchController.watchExtractSearchFeatures
    }
  }

  use = (webSocket, route, data) => {
    if (route !== "use") {
      const requestedController = this._routes[route]
      if (typeof requestedController !== "function") {
        webSocket.send(JSON.stringify({
          status: false,
          message: "route not found"
        }), err => {
          if (err) {
            this._logger.error(err)
            webSocket.close()
          }
        })
      }
      else {
        requestedController(webSocket, data)
      }
    }
    else {
      webSocket.send(JSON.stringify({
        status: false,
        message: "use route is restricted"
      }), err => {
        if (err) {
          this._logger.error(err)
          webSocket.close()
        }
      })
    }
  }
}

export default WSSRouter