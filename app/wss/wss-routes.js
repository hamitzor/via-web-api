/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import wssQueryController from "./wss-controllers/wss-query-controller"
import wssAnomalyController from "./wss-controllers/wss-anomaly-process-controller"

const routes = {
  "start-qbe": wssQueryController.startQBE,
  "watch-operation": wssQueryController.watchOperation,
  "progress-operation": wssQueryController.progressOperation,
  "start-anomaly" : wssAnomalyController.startLineCrossing,
  "anomaly-watch-operation" : wssAnomalyController.watchOperation,

}


export default routes
