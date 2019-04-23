/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import express from "express"
import homeController from "../controllers/home-controller"

const homeRouter = express.Router()


homeRouter.get("/", homeController.index)

export default homeRouter
