/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import fetchConfig from "../../util/config-fetcher"
import { spawn } from "child_process"
import WSSController from "./wss-controller"
import codes from "../../util/status-codes"
import crypto from "crypto"
import { isString, isUndefined, isFloat } from "../../util/validation-helpers"
import anomalyEventEmitter from "../../event-emmiters/anomaly-event-emitter"

class WSSAnomalyController extends WSSController {
  constructor() {
    super()
  }

  startLineCrossing = async ({ videoId, line_coord1_x, line_coord1_y, line_coord2_x, line_coord2_y }, ws) => {
  
    const operationId = crypto.randomBytes(8).toString("hex")
  
    const argsList = ["intersect_demo.py",videoId, line_coord1_x, line_coord1_y, line_coord2_x, line_coord2_y]
    
    const cwd = fetchConfig("module-path:line_crossing")
    const env = { PYTHONPATH: fetchConfig("module-path:line_crossing") }
    try {
    const process = spawn("python3", argsList, { cwd , env})
 
    ws.on("close", () => {
      process.kill()
      this._sendAndClose(ws, codes.TERMINATED_BY_USER)
    })

    anomalyEventEmitter.onTerminate(operationId, () => {
      process.kill()
      anomalyEventEmitter.didTerminate(operationId)
    })
    
    this._send(ws, codes.OK, { operationId })
  
    process.stdout.on("data", async (data) => {
      try {
        const parsedData = JSON.parse(data.toString())
        anomalyEventEmitter.progress(operationId, { progress: parsedData.progress })
      } catch (err) {
        _logger.error(err)
      }
    })
    
    process.stderr.on("data", (data) => {
      process.kill()
      _logger.error(new Error(data.toString()))
    })
    
    process.on("exit", async (code) => {
      if (code === codes.COMPLETED_SUCCESSFULLY) {
        
        _logger.info("Line Crossing Detection operation has successfully completed for video with videoId " + videoId)
      }
      else {
        
        _logger.error(new Error("Line Crossing Detection operation has failed for video with videoId " + videoId))
      }
    })
  }catch(err){
   console.error(err)
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
      anomalyEventEmitter.onProgress(operationId, (data) => {
        this._send(ws, codes.PROGRESS, data)
      })
    } catch (err) {
      this._logger.error(err)
      this._sendAndClose(ws, codes.INTERNAL_SERVER_ERROR)
    }
  }
}

export default (new WSSAnomalyController)