import mysql from "mysql2/promise"
import getConfig from "../util/config-fetcher"

class Model {
  constructor() {
    this._connection = undefined
  }

  _connect = async () => {
    this._connection = await mysql.createConnection({
      host: getConfig("database:host"),
      user: getConfig("database:username"),
      password: getConfig("database:password"),
      database: getConfig("database:name"),
      dateStrings: true
    })
  }

  _execute = async (query, data) => {
    return await this._connection.execute(query, data)
  }

  _disconnect = async () => {
    await this._connection.end()
  }

  _createSetStatementAndValues = (data) => {
    let setStatement = "SET "
    let setData = []

    Object.keys(data).forEach(field => {
      setStatement += `${field} = ?,`
      setData.push(data[field])
    })

    setStatement = setStatement.substring(0, setStatement.length - 1)

    return [setStatement, setData]
  }
}

export default Model