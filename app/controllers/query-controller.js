/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../util/logger"
import fetchConfig from "../util/config-fetcher"
import Controller from "./controller"
import codes from "../util/status-codes"
import CLIArgsToList from "../util/cli-args-to-list"
import { spawn } from "child_process"
import validator from "validator"
import crypto from "crypto"

export default class QueryController extends Controller {

  constructor() {
    super()
    this._logger = new Logger(fetchConfig("logging:directory:query"), !fetchConfig("logging:enabled"))
    this._CLIArgsToList = new CLIArgsToList({
      commonArgs: {
        "api": true,
        "db-host": fetchConfig("database:host"),
        "db-username": fetchConfig("database:username"),
        "db-password": fetchConfig("database:password"),
        "db-name": fetchConfig("database:name"),
        "websocket": true,
        "ws-host": fetchConfig("server:host").replace("http://", "").replace("https://", ""),
        "ws-port": fetchConfig("server:port"),
      }
    })
  }

  terminateQBE = async (req, res) => {
    let { operationId } = req.query
    /*Validation*/
    try {
      if (!operationId) { throw new Error("Invalid operationId") }
      operationId = operationId.trim()
      if (!validator.isLength(operationId, { min: 16, max: 16 })) { throw new Error("Invalid operationId") }
    } catch (err) {
      this._send(res, codes.BAD_REQUEST, { message: err.message })
      return
    }
    /*Validation*/

    const operationEE = req.app.get("operationEE")

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

  startEQF = (req, res) => {
    const { userId, videoId } = req.query
    /*Validation*/
    try {
      if (!userId) { throw new Error("Invalid userId") }
      if (!validator.isInt(userId)) { throw new Error("Invalid userId") }

      if (!videoId) { throw new Error("Invalid videoId") }
      if (!validator.isInt(videoId)) { throw new Error("Invalid videoId") }
    } catch (err) {
      this._send(res, codes.BAD_REQUEST, { message: err.message })
      return
    }
    /*Validation*/

    try {

      //@TODO do some checks before starting operation, is features alrady extracted etc.

      const operationId = crypto.randomBytes(8).toString("hex")
      const optionalArgs = {
        "ws-route": "progress-operation",
        "operation-id": operationId
      }

      const optionalArgsList = this._CLIArgsToList.convert(optionalArgs)

      const argsList = ["-m", "src.main_scripts.eqf", videoId, ...optionalArgsList]

      const env = { PYTHONPATH: fetchConfig("module-path:qbe") }

      const process = spawn("python", argsList, { env })

      this._send(res, codes.OK, { operationId })

      process.on("exit", async (code) => {
        /* eslint-disable */
        switch (code) {
          case codes.INTERNAL_SERVER_ERROR:
            //@TODO: handle failure, revert db changes etc.
            this._logger.error(new Error("EQF operation has failed for video with videoId " + videoId))
            break
          case codes.COMPLETED_SUCCESSFULLY:
            //@TODO: handle success
            this._logger.info("EQF operation has successfully completed for video with videoId " + videoId)
            break
          default:
            //@TODO: handle failure, revert db changes etc.
            this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
            this._logger.error(new Error("EQF operation has failed for video with videoId " + videoId))
        }
        /* eslint-enable */
      })

    }
    catch (err) {
      this._logger.error(err)
    }
  }
}