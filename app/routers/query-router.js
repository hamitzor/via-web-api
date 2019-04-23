/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import express from "express"
import queryController from "../controllers/query-controller"

const queryRouter = express.Router()

queryRouter.get("/terminate-qbe", queryController.terminateQBE)
queryRouter.get("/start-eqf", queryController.startEQF)

export default queryRouter
