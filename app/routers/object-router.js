
import express from "express"
import getDetectedObjectsByVideo from "../controllers/object-controller"

const objectRouter = express.Router()


objectRouter.get("/:videoId", getDetectedObjectsByVideo)

export default objectRouter
