import WSSSearchController from "./wss-controllers/wss-search-controller"


class WSSRouter {
  constructor(logger) {
    this._logger = logger
    this._searchController = new WSSSearchController()
    this._routes = {
      ["search-query-by-example"]: this._searchController.queryByExample,
      ["search-extract-search-features"]: this._searchController.extractSearchFeatures
    }
  }

  use = (webSocket, routeName, data) => {
    if (routeName !== "use") {
      const requestedController = this._routes[routeName]
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