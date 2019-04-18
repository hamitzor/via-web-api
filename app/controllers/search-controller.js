/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import formidable from "formidable"
import Logger from "../util/logger"
import path from "path"
import crypto from "crypto"
import OptionToStringConverter from "../util/option-to-string-converter"
import OperationModel from "../models/operation-model"
import validator from "validator"
import getConfig from "../util/config-fetcher"
import Controller from "./controller"

export default class SearchController extends Controller {

  constructor() {
    super()
    this._logger = new Logger(getConfig("logging:directory:search"), !getConfig("logging:enabled"))
    this._optionConverter = new OptionToStringConverter({
      api: true,
      "db-host": getConfig("database:host"),
      "db-username": getConfig("database:username"),
      "db-password": getConfig("database:password"),
      "db-name": getConfig("database:name"),
    })
    this._operationModel = new OperationModel()
  }

  createQBEOperation = async (req, res) => {

    const form = new formidable.IncomingForm()

    form.on("error", (err) => {
      this._sendError(res, err.message)
    })
    form.on("fileBegin", function (_, file) {
      file.path = path.resolve("/tmp", `${crypto.randomBytes(16).toString("hex")}_${file.name}`)
    })
    form.parse(req, async (_, fields, files) => {
      try {
        const exampleFile = files.exampleFile
        const { videoId, userId, min, begin, end } = fields

        if (!exampleFile) {
          form.emit("error", new Error("Example file is missing"))
        }
        if (!validator.isInt(videoId)) {
          form.emit("error", new Error("Invalid videoId"))
        }
        if (!validator.isInt(userId)) {
          form.emit("error", new Error("Invalid userId"))
        }
        if (min && !validator.isFloat(min, { min: 0.0, max: 1.0 })) {
          form.emit("error", new Error("Invalid min"))
        }
        if (begin && !validator.isInt(begin, { min: 0.0 })) {
          form.emit("error", new Error("Invalid begin"))
        }
        if (end && !validator.isInt(end, { min: 0.0 })) {
          form.emit("error", new Error("Invalid end"))
        }

        const watchId = crypto.randomBytes(8).toString("hex")

        const { insertId } = await this._operationModel.insert({ userId, videoId, watchId })

        const options = {
          min,
          begin,
          end,
          websocket: true,
          "ws-host": getConfig("server:host").replace("http://", "").replace("https://", ""),
          "ws-port": getConfig("server:port"),
          "ws-route": "update-qbe-progress",
          "operation-id": insertId
        }

        const optionVector = this._optionConverter.convert(options)

        const argv = ["-m", "src.main_scripts.qbe", videoId, exampleFile.path, ...optionVector]

        await this._operationModel.update(insertId, { argv })

        this._sendData(res, { operationId: insertId })
      }
      catch (err) {
        this._logger.error(err)
        if (!res.headersSent) {
          this._sendError(res, "Internal Server Error")
        }
      }
    })
  }

  getQBEOperation = async (req, res) => {
    const { id } = req.query

    if (!id) {
      this._sendError(res, "id is required")
      return
    }

    try {
      const operation = await this._operationModel.select(id)
      this._sendData(res, {
        operation: {
          operationId: operation.operation_id,
          userId: operation.user_id,
          startTime: operation.start_time,
          endTime: operation.end_time,
          result: JSON.parse(operation.result)
        }
      })
    }
    catch (err) {
      this._sendError(res, "Internal Server Error")
      this._logger.error(err)
    }
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