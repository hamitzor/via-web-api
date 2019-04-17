import mysql from "mysql2/promise"
import getConfig from "../util/config-fetcher"


class OperationModel {

  constructor() {
    this._connection = undefined
  }

  _connect = async () => {
    this._connection = await mysql.createConnection({
      host: getConfig("database:host"),
      user: getConfig("database:username"),
      password: getConfig("database:password"),
      database: getConfig("database:name"),
    })
  }

  _execute = async (query, data) => {
    return await this._connection.execute(query, data)
  }

  _disconnect = async () => {
    await this._connection.end()
  }

  add = async (data) => {
    await this._connect()
    const query = "INSERT INTO `operations` (`user_id`,`video_id`,`watch_id`,`expire_time`) VALUES (?,?,?,(NOW() + INTERVAL 1 MINUTE))"
    const result = await this._execute(query, [data.userId, data.videoId, data.watchId])
    await this._disconnect()
    return result[0]
  }

  get = async (id) => {
    await this._connect()
    const query = "SELECT * FROM `operations` WHERE `operation_id` = ?"
    const rows = (await this._execute(query, [id]))[0]
    await this._disconnect()
    return rows[0]
  }

  update = async (id, data) => {
    await this._connect()
    let set_statements = (Object.keys(data).reduce((acc, field) => {
      acc = acc + `${field} = ?,`
      return acc
    }, ""))

    set_statements = set_statements.substring(0, set_statements.length - 1)

    const query = `UPDATE \`operations\` SET ${set_statements}  WHERE \`operation_id\` = ?`

    const dataValues = Object.keys(data).reduce((acc, field) => [...acc, data[field]], [])
    const rows = (await this._execute(query, [...dataValues, id]))[0]
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

  getAll = async () => {
    await this._connect()
    const query = "SELECT * FROM `operations`"
    const result = await this._execute(query)
    return result
  }
}

export default OperationModel