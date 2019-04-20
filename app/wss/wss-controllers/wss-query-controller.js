/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import getConfig from "../../util/config-fetcher"
import validator from "validator"
import { spawn } from "child_process"
import WSSController from "./wss-controller"
import codes from "../../util/status-codes"
import saveBase64Image from "../../util/save-base64-image"
import crypto from "crypto"
import CLIArgsToList from "../../util/cli-args-to-list"

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
        "ws-port": getConfig("server:port"),
      }
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

      const imagePath = await saveBase64Image(encodedImage)

      const operationId = crypto.randomBytes(8).toString("hex")

      const optionalArgs = {
        "min": min,
        "begin": begin,
        "end": end,
        "ws-route": "progress-qbe",
        "operation-id": operationId
      }

      const optionalArgsList = this._CLIArgsToList.convert(optionalArgs)

      const argsList = ["-m", "src.main_scripts.qbe", videoId, imagePath, ...optionalArgsList]

      const env = { PYTHONPATH: getConfig("module-path:query") }

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

export default WSSQueryController