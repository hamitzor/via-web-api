/**
 * @fileoverview Socket server initializater for query by example service.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import getConfig from "../../util/config-fetcher"
import ArgumentListModel from "../../models/argument-list-model"
import validator from "validator"
import { spawn } from "child_process"
import WSSController from "./wss-controller"
import codes from "../../util/status-codes"
import saveBase64Image from "../../util/save-base64-image"
import crypto from "crypto"
import OptionToStringConverter from "../../util/option-to-string-converter"

class WSSSearchController extends WSSController {
  constructor() {
    super()
    this._operationModel = new ArgumentListModel()
    this._optionConverter = new OptionToStringConverter({
      "api": true,
      "websocket": true,
      "db-host": getConfig("database:host"),
      "db-username": getConfig("database:username"),
      "db-password": getConfig("database:password"),
      "db-name": getConfig("database:name"),
      "ws-host": getConfig("server:host").replace("http://", "").replace("https://", ""),
      "ws-port": getConfig("server:port"),
    })
  }

  startQBE = async ({ userId, videoId, encodedImage, min, begin, end }, ws, operationEE) => {
    try {
      if (!encodedImage) { throw new Error("Example file is missing") }
      if (!validator.isInt(videoId + "")) { throw new Error("Invalid videoId") }
      if (!validator.isInt(userId + "")) { throw new Error("Invalid userId") }
      if (min && !validator.isFloat(min + "", { min: 0.0, max: 1.0 })) { throw new Error("Invalid min") }
      if (begin && !validator.isInt(begin + "", { min: 0.0 })) { throw new Error("Invalid begin") }
      if (end && !validator.isInt(end + "", { min: 0.0 })) { throw new Error("Invalid end") }

      const operationId = crypto.randomBytes(8).toString("hex")

      const options = {
        min,
        begin,
        end,
        "ws-route": "progress-qbe",
        "operation-id": operationId
      }

      const optionVector = this._optionConverter.convert(options)

      const imagePath = await saveBase64Image(encodedImage)

      const argv = ["-m", "src.main_scripts.qbe", videoId, imagePath, ...optionVector]

      const env = { PYTHONPATH: getConfig("module-path:search") }

      const process = spawn("python", argv, { env })

      process.on("exit", async (code) => {
        try {
          /* eslint-disable */
          switch (code) {
            case codes.INTERNAL_SERVER_ERROR:
              this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
              break
            case codes.TERMINATED_BY_USER:
              this._sendAndClose(ws, codes.TERMINATED_BY_USER)
              break
            case codes.COMPLETED_SUCCESSFULLY:
              this._sendAndClose(ws, codes.COMPLETED_SUCCESSFULLY)
              break
            default:
              this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
          }
          /* eslint-enable */
        }
        catch (err) {
          this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
          this._logger.error(err)
        }
      })

      operationEE.onTerminate(operationId, () => {
        process.kill("SIGUSR1")
        operationEE.didTerminate(operationId)
      })

      ws.on("close", () => {
        setTimeout(() => {
          process.kill("SIGUSR1")
        }, 1000)
      })

      this._send(ws, codes.OK, { operationId })
    }
    catch (err) {
      this._logger.error(err)
      this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
    }
  }

  watchQBE = async ({ operationId }, ws, operationEE) => {
    try {

      if (!operationId) {
        throw new Error("Invalid operationId")
      }

      operationEE.onProgress(operationId, (data) => {
        this._send(ws, codes.PROGRESS, data)
      })

    } catch (err) {
      this._logger.error(err)
      this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
    }
  }

  progressQBE = ({ operationId, progress, results }, ws, operationEE) => {
    try {
      if (!operationId) {
        throw new Error("Invalid operationId")
      }
      operationEE.progress(operationId, { progress, results })

    } catch (err) {
      this._logger.error(err)
      ws.close()
    }
  }
}

export default WSSSearchController