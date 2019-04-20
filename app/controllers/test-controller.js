/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import path from "path"

export default class QueryController {

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

  fileUploadTest = (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client-test-pages/test-page-upload-file.html")
    )
  }




}