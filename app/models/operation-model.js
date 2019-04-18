import Model from "./model"


class OperationModel extends Model {

  insert = async (data) => {
    await this._connect()
    const query = "INSERT INTO `operations` (`user_id`,`video_id`,`watch_id`) VALUES (?,?,?)"
    const result = await this._execute(query, [data.userId, data.videoId, data.watchId])
    await this._disconnect()
    return result[0]
  }

  select = async (id) => {
    await this._connect()
    const query = "SELECT * FROM `operations` WHERE `operation_id` = ?"
    const rows = (await this._execute(query, [id]))[0]
    await this._disconnect()
    return rows[0]
  }

  update = async (id, data) => {
    await this._connect()

    const [setStatement, setData] = this._createSetStatementAndValues(data)

    const query = `UPDATE \`operations\` ${setStatement} WHERE \`operation_id\` = ?`

    const rows = (await this._execute(query, [...setData, id]))[0]
    await this._disconnect()
    return rows[0]
  }

  delete = async (id) => {
    await this._connect()
    const query = "DELETE FROM `operations` WHERE `operation_id` = ?"
    const result = await this._execute(query, [id])
    await this._disconnect()
    return result[0]
  }

  selectAll = async () => {
    await this._connect()
    const query = "SELECT * FROM `operations`"
    const result = await this._execute(query)
    return result
  }
}

export default OperationModel