/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import getConfig from "../../util/config-fetcher"
import { spawn } from "child_process"
import WSSController from "./wss-controller"
import codes from "../../util/status-codes"
import saveBase64Image from "../../util/save-base64-image"
import crypto from "crypto"
import CLIArgsToList from "../../util/cli-args-to-list"
import { isString, isUndefined, isFloat } from "../../util/validation-helpers"

class WSSQueryController extends WSSController {
  constructor() {
    super()
    this._CLIArgsToList = new CLIArgsToList({
      commonArgs: {
        "api": true,
        "db-host": getConfig("database:host"),
        "db-username": getConfig("database:username"),
        "db-password": getConfig("database:password"),
        "db-name": getConfig("database:name"),
        "websocket": true,
        "ws-host": getConfig("server:host").replace("http://", "").replace("https://", ""),
        "ws-port": getConfig("server:port")
      }
    })
  }

  startQBE = async ({ userId, videoId, encodedImage, min, begin, end }, ws, operationEE) => {
    try {
      /*Validation*/
      try {
        if (!Number.isInteger(userId)) { throw new Error("Invalid userId") }
        if (!Number.isInteger(videoId)) { throw new Error("Invalid videoId") }
        if (!isString(encodedImage)) { throw new Error("Invalid encodedImage") }
        if (!isUndefined(min) && !isFloat(min)) { throw new Error("Invalid min") }
        if (!isUndefined(begin) && !Number.isInteger(begin)) { throw new Error("Invalid begin") }
        if (!isUndefined(end) && !Number.isInteger(end)) { throw new Error("Invalid end") }
      } catch (err) {
        this._sendAndClose(ws, codes.BAD_REQUEST, { message: err.message })
        return
      }
      /*Validation*/

      const imagePath = await saveBase64Image(encodedImage)

      const operationId = crypto.randomBytes(8).toString("hex")

      const optionalArgs = {
        "min": min,
        "begin": begin,
        "end": end,
        "ws-route": "progress-operation",
        "operation-id": operationId
      }

      const optionalArgsList = this._CLIArgsToList.convert(optionalArgs)

      const argsList = ["-m", "src.main_scripts.qbe", videoId, imagePath, ...optionalArgsList]

      const env = { PYTHONPATH: getConfig("module-path:qbe") }

      const process = spawn("python", argsList, { env })

      this._send(ws, codes.OK, { operationId })

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
    }
    catch (err) {
      this._logger.error(err)
      this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
    }
  }

  watchOperation = async ({ operationId }, ws, operationEE) => {
    /*Validation*/
    try {
      if (!isString(operationId)) { throw new Error("Invalid operationId") }
      operationId = operationId.trim()
      if (operationId.length !== 16) { throw new Error("Invalid operationId") }
    } catch (err) {
      this._sendAndClose(ws, codes.BAD_REQUEST, { message: err.message })
      return
    }
    /*Validation*/
    try {
      operationEE.onProgress(operationId, (data) => {
        this._send(ws, codes.PROGRESS, data)
      })
    } catch (err) {
      this._logger.error(err)
      this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
    }
  }

  progressOperation = ({ operationId, progress, results }, ws, operationEE) => {
    /*Validation*/
    try {
      if (!isString(operationId)) { throw new Error("Invalid operationId") }
      operationId = operationId.trim()
      if (operationId.length !== 16) { throw new Error("Invalid operationId") }
      if (!isUndefined(progress) && !Number.isInteger(progress)) { throw new Error("Invalid progress") }
    } catch (err) {
      this._sendAndClose(ws, codes.BAD_REQUEST, { message: err.message })
      return
    }
    /*Validation*/
    try {
      operationEE.progress(operationId, { progress, results })
    } catch (err) {
      this._logger.error(err)
      ws.close()
    }
  }
}

export default WSSQueryController