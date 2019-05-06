/**
 * @author thenrerise@gmail.com (Hamit Zor)
 * @author umutguler97@gmail.com (Göksen Umut GÜLER)
 */

import express from "express"
import testController from "../controllers/test-controller"

const testRouter = express.Router()


testRouter.get("/", testController.index)
testRouter.get("/file-upload", testController.fileUploadTest)
testRouter.get("/query-test", testController.queryTest)
testRouter.get("/anomaly-test", testController.anomalyTest)
testRouter.get("/object-test", testController.objectTest)
export default testRouter
