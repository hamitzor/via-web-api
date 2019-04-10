/**
 * @fileoverview Socket class for handling socket connections dealing with search operations.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import WebSocket from "ws"
import Logger from "../util/logger"
import config from "../../app.config"
import saveBase64Image from '../util/save-base64-image'
import SearchService from '../service/search-service'


class SearchSocket {
  constructor(port) {
    this.port = port
    this._logger = new Logger(config.log.directory.search, !config.log.enabled)
    this._service = new SearchService({ api: true })
  }

  start = () => {
    // Start socket on specified port
    const searchSocket = new WebSocket.Server({ port: this.port })
    const onMessage = async (ws, message) => {
      const data = JSON.parse(message)
      this._logger.info(`Request on Search WebSocket on port:${this.port} for Video ${data.videoId}`)
      try {
        if (typeof data.videoId !== "number") {
          ws.send(JSON.stringify({
            status: false,
            message: "videoId is not valid"
          }), (err) => {
            if (err) { this._logger.error(err) }
          })
        }
        else {
          const savedImagePath = await saveBase64Image(data.base64Image)
          const result = await this._service.queryByExample(data.videoId, savedImagePath, { min: data.min, begin: data.begin, end: data.end })
          ws.send(JSON.stringify({
            status: true,
            result
          }), (err) => {
            if (err) { this._logger.error(err) }
          })
        }
      } catch (err) {
        ws.send(JSON.stringify({
          status: false,
          message: "Internal Server Error"
        }), (err) => {
          if (err) { this._logger.error(err) }
        })

        this._logger.error(err)
      }
    }

    searchSocket.on("connection", (ws) => {
      this._logger.info(`Started Search WebSocket connection on port:${this.port}`)
      ws.on("message", (message) => {
        onMessage(ws, message)
      })
    })
  }
}

export default SearchSocket