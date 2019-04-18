/**
 * @fileoverview Socket server initializater for query by example service.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import getConfig from "../../util/config-fetcher"
import OperationModel from "../../models/operation-model"
import validator from "validator"
import { spawn } from "child_process"
import WSSController from "./wss-controller"

class WSSSearchController extends WSSController {
  constructor() {
    super()
    this._operationModel = new OperationModel()
  }

  startQBE = async ({ operationId }, ws) => {
    try {
      if (!validator.isInt(operationId + "")) {
        throw new Error("Invalid operationId")
      }

      const operation = await this._operationModel.select(operationId)

      if (!operation) {
        throw new Error("Wrong operationId")
      }

      const { argv } = operation

      const env = {
        PYTHONPATH: getConfig("module-path:search")
      }
      const process = spawn("python", JSON.parse(argv), { env })

      process.on("error", (err) => {
        this._sendError(ws, "Internal Server Error")
        ws.close()
        this._logger.error(err)
      })

      ws.on("close", async () => {
        this._logger.info(`Terminated QBE operation with operationId "${operationId}" , for WebSocket connection is lost`)
        process.kill()
      })

      this._sendData(ws, { operationId })
    }
    catch (err) {
      this._logger.error(err)
      this._sendError(ws, "Internal Server Error")
    }
  }

  watchQBE = async ({ operationId }, ws, sharedData) => {
    try {

      if (!validator.isInt(operationId + "")) {
        throw new Error("Invalid operationId")
      }

      const operation = await this._operationModel.select(operationId)

      if (!operation) {
        throw new Error("Wrong operationId")
      }

      const { watch_id: watchId } = operation

      sharedData.on("upgrade", (name, value) => {
        if (name === watchId) {
          this._sendData(ws, { progress: value })
        }
      })

    } catch (err) {
      this._logger.error(err)
      this._sendError(ws, "Internal Server Error")
    }
  }

  updateQBEProgress = ({ id: watchId, value: progress }, ws, sharedData) => {
    try {

      if (!watchId) {
        throw new Error("Invalid id")
      }

      if (!validator.isNumeric(progress + "")) {
        throw new Error("Invalid value")
      }

      sharedData.set(watchId, progress)

    } catch (err) {
      this._logger.error(err)
      ws.close()
    }
  }
}

export default WSSSearchController