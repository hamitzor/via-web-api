/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import express from "express"
import QueryController from "../controllers/query-controller"

const queryRouter = express.Router()

const queryController = new QueryController()

queryRouter.get("/terminate-qbe", queryController.terminateQBE)
queryRouter.get("/start-eqf", queryController.startEQF)

export default queryRouter
