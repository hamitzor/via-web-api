import Model from "./model"

class OperationModel extends Model {
  select = async () => {
    await this.connect()
    const result = this.conn.execute("SELECT * FROM `videos`")
    this.disconnect()
    return result
  }
}

export default OperationModel