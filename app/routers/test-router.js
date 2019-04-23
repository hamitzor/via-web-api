/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import express from "express"
import testController from "../controllers/test-controller"

const testRouter = express.Router()


testRouter.get("/", testController.index)
testRouter.get("/file-upload", testController.fileUploadTest)
testRouter.get("/query-test", testController.queryTest)

export default testRouter
