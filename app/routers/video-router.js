/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import express from "express"
import videoController from "../controllers/video-controller"

const videoRouter = express.Router()


videoRouter.get("/", videoController.getVideos)

videoRouter.get("/:videoId", videoController.getVideo)

videoRouter.delete("/:videoId", videoController.deleteVideo)

videoRouter.post("/", videoController.postVideo)


export default videoRouter
