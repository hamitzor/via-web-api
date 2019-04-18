/**
 * @fileoverview Socket server initializater for query by example service.
 * @author thenrerise@gmail.com (Hamit Zor)
 */
import WSS from "./wss"

const WSSFactory = (() => {
  let wssInstance = null
  return {
    getInstance: (server) => {
      if (wssInstance == null) {
        wssInstance = new WSS(server)
        wssInstance.constructor = null
      }
      return wssInstance
    }
  }
})()


export default WSSFactory