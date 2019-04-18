/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */


export default class Controller {

  _sendError = (res, message) => {
    res.send(JSON.stringify({ status: false, message })).end()
  }

  _sendData = (res, data) => {
    res.send(JSON.stringify({ status: true, data })).end()
  }
}