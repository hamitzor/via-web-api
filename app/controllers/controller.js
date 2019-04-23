/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


export default class Controller {
  _send = (res, status, data) => {
    if (!res.heardersSent) {
      res.send(JSON.stringify({ status, data })).end()
    }
  }
}