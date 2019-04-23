/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import wssQueryController from "./wss-controllers/wss-query-controller"


const routes = {
  "start-qbe": wssQueryController.startQBE,
  "watch-operation": wssQueryController.watchOperation,
  "progress-operation": wssQueryController.progressOperation
}


export default routes
