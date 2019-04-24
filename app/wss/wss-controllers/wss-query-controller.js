/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import fetchConfig from "../../util/config-fetcher"
import { spawn } from "child_process"
import WSSController from "./wss-controller"
import codes from "../../util/status-codes"
import saveBase64Image from "../../util/save-base64-image"
import crypto from "crypto"
import CLIArgsToList from "../../util/cli-args-to-list"
import { isString, isUndefined, isFloat } from "../../util/validation-helpers"
import operationEE from "../../event-emmiters/operation-ee"

class WSSQueryController extends WSSController {
  constructor() {
    super()
    this._cliArgsToList = new CLIArgsToList({
      commonArgs: {
        "db-host": fetchConfig("database:host"),
        "db-username": fetchConfig("database:username"),
        "db-password": fetchConfig("database:password"),
        "db-name": fetchConfig("database:name")
      }
    })
  }

  startQBE = async ({ videoId, encodedImage, min, begin, end }, ws) => {
    try {
      /*Validation*/
      try {
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
        "end": end
      }

      const optionalArgsList = this._cliArgsToList.convert(optionalArgs)

      const argsList = ["-m", "packages.main_scripts.qbe", videoId, imagePath, ...optionalArgsList]

      const env = { PYTHONPATH: fetchConfig("module-path:qbe") }

      const process = spawn("python", argsList, { env })

      ws.on("close", () => {
        process.kill()
        this._sendAndClose(ws, codes.TERMINATED_BY_USER)
      })

      operationEE.onTerminate(operationId, () => {
        process.kill()
        operationEE.didTerminate(operationId)
        this._sendAndClose(ws, codes.TERMINATED_BY_USER)
      })

      this._send(ws, codes.OK, { operationId })

      process.stdout.on("data", async (data) => {
        try {
          const parsedData = JSON.parse(data.toString())
          operationEE.progress(operationId, { progress: parsedData.progress, results: parsedData.results })
        } catch (err) {
          this._logger.error(err)
        }
      })

      process.stderr.on("data", (data) => {
        process.kill()
        this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
        this._logger.error(new Error(data.toString()))
      })

      process.on("exit", async (code) => {
        try {
          if (code === codes.COMPLETED_SUCCESSFULLY) {
            this._sendAndClose(ws, codes.COMPLETED_SUCCESSFULLY)
          }
          else {
            this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
          }
        }
        catch (err) {
          this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
          this._logger.error(err)
        }
      })
    }
    catch (err) {
      this._logger.error(err)
      this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
    }
  }

  watchOperation = async ({ operationId }, ws) => {
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
}

export default (new WSSQueryController)