import mysql from "mysql2/promise"
import config from "../../app.config"


class SearchOperationModel {

  constructor() {
    this._connection = undefined
  }

  _connect = async () => {
    this._connection = await mysql.createConnection({
      host: config.database.host,
      user: config.database.username,
      password: config.database.password,
      database: config.database.name
    })
  }

  add = async (data) => {
    await this._connect()
    const query = "INSERT INTO `search_operations` (`user_id`,`video_id`) VALUES (?,?)"
    return (await this._connection.execute(query, [data.userId, data.videoId]))[0]
  }

  get = async (id) => {
    await this._connect()
    const query = "SELECT * FROM `search_operations` WHERE `search_operation_id` = ?"
    const [rows, fields] = await this._connection.execute(query, [id])
    return [rows[0], fields]
  }

  delete = async (id) => {
    await this._connect()
    const query = "DELETE FROM `search_operations` WHERE `search_operation_id` = ?"
    return await this._connection.execute(query, [id])
  }


  getAll = async () => {
    await this._connect()
    const query = "SELECT * FROM `search_operations`"
    return await this._connection.execute(query)
  }
}

export default SearchOperationModel