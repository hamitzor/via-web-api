/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import express from "express"
import * as videoControllers from "../controllers/video"

const router = express.Router()

router.get("/", videoControllers.getVideos)

router.get("/:videoId", videoControllers.getVideo)

// Not working example resquest:
// http://localhost:3000/video/3/9999-03-26/23:16:43/Query!!!!!!!!Testing/60166.7/.mp4/demo.mp4/8305931/homeviavia-projectmedia_sourcedemo.mp4/12/722/640
router.post("/upload", videoControllers.postVideo)

router.delete("/:videoId", videoControllers.deleteVideo)

export default router
