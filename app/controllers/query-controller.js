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
import operationEE from "../event-emmiters/operation-ee"
import videoModel from "../models/video-model"
import eqfStatusCodes from "../util/eqf-status-codes"

class QueryController extends Controller {

  constructor() {
    super()
    this._logger = new Logger(fetchConfig("logging:directory:query"))
    this._cliArgsToList = new CLIArgsToList({
      commonArgs: {
        "db-host": fetchConfig("database:host"),
        "db-username": fetchConfig("database:username"),
        "db-password": fetchConfig("database:password"),
        "db-name": fetchConfig("database:name")
      }
    })
  }

  terminateOperation = async (req, res) => {
    let { operationId } = req.params
    /*Validation*/
    try {
      if (!validator.isLength(operationId, { min: 16, max: 16 })) { throw new Error("Invalid operationId") }
    } catch (err) {
      this._send(res, codes.BAD_REQUEST, { message: err.message })
      return
    }
    /*Validation*/

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

  startEQF = async (req, res) => {
    const { videoId } = req.params
    /*Validation*/
    try {
      if (!validator.isInt(videoId)) { throw new Error("Invalid videoId") }
    } catch (err) {
      this._send(res, codes.BAD_REQUEST, { message: err.message })
      return
    }
    /*Validation*/

    try {

      const video = (await videoModel.fetchById(videoId))[0][0]

      if (!video) {
        this._send(res, codes.BAD_REQUEST, { message: "Wrong videoId" })
        return
      }

      if (video.eqf_status === eqfStatusCodes.FINISHED || video.eqf_status === eqfStatusCodes.STARTED) {
        this._send(res, codes.BAD_REQUEST, { message: "EQF is already started or finished" })
        return
      }

      const operationId = crypto.randomBytes(8).toString("hex")

      const optionalArgsList = this._cliArgsToList.convert()

      const argsList = ["-m", "packages.main_scripts.eqf", videoId, ...optionalArgsList]

      const env = { PYTHONPATH: fetchConfig("module-path:qbe") }

      const process = spawn("python", argsList, { env })

      videoModel.updateById(videoId, { eqf_status: eqfStatusCodes.STARTED })

      operationEE.onTerminate(operationId, () => {
        process.kill()
        operationEE.didTerminate(operationId)
      })

      this._send(res, codes.OK, { operationId })

      process.stdout.on("data", async (data) => {
        try {
          const parsedData = JSON.parse(data.toString())
          operationEE.progress(operationId, { progress: parsedData.progress })
        } catch (err) {
          this._logger.error(err)
        }
      })

      process.stderr.on("data", (data) => {
        process.kill()
        this._logger.error(new Error(data.toString()))
      })

      process.on("exit", async (code) => {
        if (code === codes.COMPLETED_SUCCESSFULLY) {
          videoModel.updateById(videoId, { eqf_status: eqfStatusCodes.FINISHED })
          this._logger.info("EQF operation has successfully completed for video with videoId " + videoId)
        }
        else {
          videoModel.updateById(videoId, { eqf_status: eqfStatusCodes.INTERRUPTED })
          this._logger.error(new Error("EQF operation has failed for video with videoId " + videoId))
        }
      })

    }
    catch (err) {
      this._logger.error(err)
    }
  }
}

export default (new QueryController)