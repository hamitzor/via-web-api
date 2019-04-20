import WSSQueryController from "./wss-controllers/wss-query-controller"

const queryController = new WSSQueryController()

const routes = {
  "start-qbe": queryController.startQBE,
  "watch-qbe": queryController.watchQBE,
  "progress-qbe": queryController.progressQBE
}


export default routes
