/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import path from "path"

class HomeController {

  index = (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../app/index.html")
    )
  }
}

export default (new HomeController)