/**
 * @fileoverview Socket server initializater for query by example service.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import SearchService from "../../services/search-service"
import Logger from "../../util/logger"
import config from "../../../app.config"
import VideoModel from "../../models/video"
import SearchOperationModel from "../../models/search-operation-model"


class WSSSearchController {
  constructor() {
    this._service = new SearchService({ api: true })
    this._logger = new Logger(config.log.directory.wss, !config.log.enabled)
    this._searchOperationModel = new SearchOperationModel()
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

  watchExtractSearchFeatures = async (webSocket, data) => {
    try {
      const videoId = data.videoId

      const interval = setInterval(async () => {
        const progress = (await VideoModel.fetchById(videoId))[0][0].search_process_progress
        webSocket.send(JSON.stringify({
          status: true,
          progress
        }), err => {
          if (err) {
            this._logger.error(err)
            webSocket.close()
          }
          else {
            if (progress === 100) {
              clearInterval(interval)
            }
          }
        })
      }, 500)

    } catch (err) {
      this._logger.error(err)
      this._sendError(webSocket, "Internal Server Error")
    }
  }

  watchQueryByExample = async (webSocket, data) => {
    try {
      const id = data.searchOperationId

      const interval = setInterval(async () => {
        const searchOperation = (await this._searchOperationModel.get(id))[0]
        webSocket.send(JSON.stringify({
          status: true,
          data: searchOperation
        }), err => {
          if (err) {
            this._logger.error(err)
            webSocket.close()
          }
          else {
            if (searchOperation.progress === 100) {
              clearInterval(interval)
            }
          }
        })
      }, 500)

    } catch (err) {
      this._logger.error(err)
      this._sendError(webSocket, "Internal Server Error")
    }
  }
}

export default WSSSearchController