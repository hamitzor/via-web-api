/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../util/logger"
import fetchConfig from "../util/config-fetcher"
import Controller from "./controller"
import codes from "../util/status-codes"
import { spawn } from "child_process"
import validator from "validator"
import crypto from "crypto"
import anomalyEventEmitter from "../event-emmiters/anomaly-event-emitter"

class AnomalyLineController extends Controller {

  constructor() {
    super()
    this._logger = new Logger(fetchConfig("logging:directory:query"))
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
}

export default (new AnomalyLineController)