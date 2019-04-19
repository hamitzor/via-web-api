/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import express from "express"
import SearchController from "../controllers/search-controller"

const router = express.Router()

const searchController = new SearchController()

router.get("/terminate-qbe", searchController.terminateQBE)

router.get("/esf", searchController.ESF)

export default router
