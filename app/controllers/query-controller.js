/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import Logger from "../util/logger"
import getConfig from "../util/config-fetcher"
import Controller from "./controller"
import codes from "../util/status-codes"

export default class QueryController extends Controller {

  constructor() {
    super()
    this._logger = new Logger(getConfig("logging:directory:query"), !getConfig("logging:enabled"))
  }

  terminateQBE = async (req, res) => {

    const operationEE = req.app.get("operationEE")

    const { operationId } = req.query

    if (!operationId) {
      this._send(res, codes.BAD_REQUEST, { message: "operationId is required" })
      return
    }

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