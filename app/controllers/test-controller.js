/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import path from "path"

class TestController {

  index = (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client-test-pages/test-page-index.html")
    )
  }

  queryTest = (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client-test-pages/test-page-query.html")
    )
  }
  anomalyTest = (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client-test-pages/test-page-anomaly.html")
    )
  }
  activityTest = (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client-test-pages/test-page-anomaly-activity.html")
    )
  }
  fileUploadTest = (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client-test-pages/test-page-upload-file.html")
    )
  }
  objectTest = (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client-test-pages/test-page-object.html")
    )
  }
}

export default (new TestController)