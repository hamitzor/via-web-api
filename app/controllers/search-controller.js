/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../util/logger"
import ArgumentListModel from "../models/argument-list-model"
import getConfig from "../util/config-fetcher"
import Controller from "./controller"
import codes from "../util/status-codes"

export default class SearchController extends Controller {

  constructor() {
    super()
    this._logger = new Logger(getConfig("logging:directory:search"), !getConfig("logging:enabled"))
    this._argumentListModel = new ArgumentListModel()
  }

  terminateQBE = async (req, res) => {

    const operationEE = req.app.get("operationEE")

    const { operationId } = req.query

    if (!operationId) {
      this._send(res, codes.BAD_REQUEST, { message: "operationId is required" })
      return
    }

    const timeout = setTimeout(() => {
      this._send(res, codes.BAD_REQUEST, { message: "operationId is wrong" })
    }, 1000)

    operationEE.onDidTerminate(operationId, () => {
      if (!res.headersSent) {
        clearTimeout(timeout)
        this._send(res, codes.OK)
      }
    })

    operationEE.terminate(operationId)
  }

  ESF = async (req, res) => {
    const { videoId, begin, end } = req.query
    if (!videoId) {
      res.send(JSON.stringify({ status: false, message: "videoId is required" })).end()
      return
    }

    const options = { begin, end }

    res.send(JSON.stringify({ status: true })).end()

    try {
      await this._optionConverter.ESF(videoId, options)
    }
    catch (err) {
      this._logger.error(err)
    }
  }
}