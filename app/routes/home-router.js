/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import express from "express"
import HomeController from "../controllers/home-controller"

const homeRouter = express.Router()

const homeController = new HomeController()

homeRouter.get("/", homeController.index)

export default homeRouter
