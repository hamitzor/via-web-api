/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import express from "express"
import * as videoControllers from "../controllers/video"

const router = express.Router()

router.get("/", videoControllers.getVideos)

router.get("/:videoId", videoControllers.getVideo)

router.post("/", videoControllers.postVideo)

router.delete("/", videoControllers.deleteVideo)

router.put("/", videoControllers.putVideo)

export default router
