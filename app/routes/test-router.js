/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import express from "express"
import TestController from "../controllers/test-controller"

const testRouter = express.Router()

const testController = new TestController()

testRouter.get("/", testController.index)
testRouter.get("/file-upload", testController.fileUploadTest)
testRouter.get("/query-test", testController.queryTest)

export default testRouter
