/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import express from "express"
import queryController from "../controllers/query-controller"

const queryRouter = express.Router()

queryRouter.get("/terminate-operation/:operationId", queryController.terminateOperation)
queryRouter.get("/start-eqf/:videoId", queryController.startEQF)

export default queryRouter
