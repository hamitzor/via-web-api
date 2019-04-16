/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import express from "express"
import * as videoControllers from "../controllers/video"

const router = express.Router()

router.get("/", videoControllers.getVideos)

router.get("/:videoId", videoControllers.getVideo)

router.post("/upload", videoControllers.postVideo)

router.delete("/:videoId", videoControllers.deleteVideo)

export default router
