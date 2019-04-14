/**
 * @fileoverview Socket server initializater for query by example service.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import SearchService from "../../services/search-service"
import Logger from "../../util/logger"
import config from "../../../app.config"
import saveBase64Image from "../../util/save-base64-image"


class WSSSearchController {
  constructor() {
    this._service = new SearchService({ api: true })
    this._logger = new Logger(config.log.directory.wssSearchController, !config.log.enabled)
  }

  _sendError = (webSocket, errorMessage) => {
    webSocket.send(JSON.stringify({
      status: false,
      message: errorMessage
    }), err => {
      if (err) {
        this._logger.error(err)
        webSocket.close()
      }
    })
  }

  extractSearchFeatures = async (webSocket, data) => {
    try {
      const videoId = data.videoId
      const options = { begin: data.begin, end: data.end }
      this._service.extractSearchFeatures(videoId, options)

      //@TODO: implement real logic. get process percentage and inform client.
      let process = 0

      const interval = setInterval(() => {
        if (process > 100) {
          clearInterval(interval)
        }
        webSocket.send(JSON.stringify({
          status: true,
          process: process
        }), err => {
          process = process + 10
          if (err) {
            this._logger.error(err)
            webSocket.close()
          }
        })
      }, 1000)

    } catch (err) {
      this._logger.error(err)
      this._sendError(webSocket, "Internal Server Error")
    }
  }

  queryByExample = async (webSocket, data) => {
    try {
      const videoId = data.videoId
      const exampleImageFilepath = await saveBase64Image(data.base64Image)
      const options = { min: data.min, begin: data.begin, end: data.end }
      const result = await this._service.queryByExample(videoId, exampleImageFilepath, options)

      webSocket.send(JSON.stringify({
        status: true,
        result
      }), err => {
        if (err) {
          this._logger.error(err)
          webSocket.close()
        }
      })
    } catch (err) {
      this._logger.error(err)
      this._sendError(webSocket, "Internal Server Error")
    }
  }
}

export default WSSSearchController