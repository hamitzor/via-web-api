/**
 * @author umutguler97@gmail.com (Göksen Umut GÜLER)
 */

import express from "express"
import * as anomalyController from "../controllers/anomaly-controller"


const router = express.Router()


router.get("/:videoId", anomalyController.getAnomaliesByVideo)
router.get("/linecrossing/:videoId", anomalyController.getLineCrossingDetectionByVideo)

export default router