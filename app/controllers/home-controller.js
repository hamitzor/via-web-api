/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import path from "path"

export default class QueryController {

  index = (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../app/index.html")
    )
  }
}