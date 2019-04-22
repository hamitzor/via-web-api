/**
 * @author umutguler97@gmail.com (Göksen Umut GÜLER)
 */

import express from "express"
import * as anomalyController from "../controllers/anomaly-controller"
const anomalyRouter = express.Router()

const router = express.Router()


router.get("/:videoId", anomalyController.getAnomaliesByVideo)

export default router