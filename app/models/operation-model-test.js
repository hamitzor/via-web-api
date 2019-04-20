import OperationModel from "./operation-model"

(async () => {
  const operationModel = new OperationModel()

  console.log((await operationModel.select())[0])
})()