/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import formidable from "formidable"
import config from "../../app.config"
import Logger from "../util/logger"
import path from "path"
import crypto from "crypto"
import SearchService from "../services/search-service"
import SearchOperationModel from "../models/search-operation-model"

export default class SearchController {

  constructor() {
    this._logger = new Logger(config.log.directory.search, !config.log.enabled)
    this._service = new SearchService({ api: true })
  }

  queryByExample = async (req, res) => {
    const searchOperationModel = new SearchOperationModel()
    const form = new formidable.IncomingForm()
    const fields = {}
    let exampleImageFilepath = ""
    form.on("error", (err) => {
      res.send(JSON.stringify({ status: false, message: "Internal Server Error" }))
      this._logger.error(err)
    })

    form.on("fileBegin", function (name, file) {
      if (name !== "exampleFile") {
        form.emit("error", new Error("Wrong file upload name"))
      }
      file.path = path.resolve("/tmp", `${crypto.randomBytes(16).toString("hex")}_${file.name}`)
    })

    form.on("field", (name, field) => {
      fields[name] = field
    })

    form.on("file", (_, file) => {
      exampleImageFilepath = file.path
    })

    form.on("end", async () => {
      const { videoId, userId, min, begin, end } = fields

      const { insertId } = await searchOperationModel.add({ userId, videoId })

      const options = { min, begin, end, "search-operation-id": insertId }
      res.send(JSON.stringify({ status: true, searchOperationId: insertId })).end()

      try {
        await this._service.queryByExample(videoId, exampleImageFilepath, options)
      }
      catch (err) {
        this._logger.error(err)
      }
    })

    form.parse(req)
  }

  extractSearchFeatures = async (req, res) => {
    const { videoId, begin, end } = req.query
    if (!videoId) {
      res.send(JSON.stringify({ status: false, message: "videoId is required" })).end()
      return
    }

    const options = { begin, end }

    res.send(JSON.stringify({ status: true })).end()

    try {
      await this._service.extractSearchFeatures(videoId, options)
    }
    catch (err) {
      this._logger.error(err)
    }
  }
}