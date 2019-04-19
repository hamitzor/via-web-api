/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import { EventEmitter } from "events"

class OperationEE extends EventEmitter {

  constructor() {
    super()
    this.setMaxListeners(Infinity)
  }

  _emit = (eventName, operationId, data) => {
    this.emit(`${eventName}_${operationId}`, data)
  }

  _on = (eventName, operationId, callback) => {
    this.on(`${eventName}_${operationId}`, callback)
  }

  terminate = (operationId) => {
    this._emit("terminate", operationId)
  }

  onTerminate = (operationId, callback) => {
    this._on("terminate", operationId, callback)
  }

  progress = (operationId, data) => {
    this._emit("progress", operationId, data)
  }

  onProgress = (operationId, callback) => {
    this._on("progress", operationId, callback)
  }

  didTerminate = (operationId) => {
    this._emit("didTerminate", operationId)
  }

  onDidTerminate = (operationId, callback) => {
    this._on("didTerminate", operationId, callback)
  }
}

export default OperationEE