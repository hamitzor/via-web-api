/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import express from "express"
import SearchController from "../controllers/search-controller"

const router = express.Router()

const searchController = new SearchController()

router.post("/query-by-example", searchController.queryByExample)
router.get("/extract-search-features", searchController.extractSearchFeatures)

export default router
