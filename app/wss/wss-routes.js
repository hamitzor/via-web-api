import WSSQueryController from "./wss-controllers/wss-query-controller"

const queryController = new WSSQueryController()

const routes = {
  "start-qbe": queryController.startQBE,
  "watch-operation": queryController.watchOperation,
  "progress-operation": queryController.progressOperation
}


export default routes
