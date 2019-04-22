/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import express from "express"
import * as videoControllers from "../controllers/video-controller"
import multer from "multer"
import path from "path"

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "/../../media-source/video"))
  },
  filename: function(req, file, cb) {
    const index = file.originalname.indexOf(".")
    const fileExtension = file.originalname.substring(index)
    cb(null, file.fieldname + "-" + Date.now() + fileExtension)
  }
})

var upload = multer({ storage: storage })

const router = express.Router()

router.get("/", videoControllers.getVideos)

router.get("/:videoId", videoControllers.getVideo)

router.post("/upload", upload.single("video"), videoControllers.postVideo)

router.delete("/:videoId", videoControllers.deleteVideo)

export default router
