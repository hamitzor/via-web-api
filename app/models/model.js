/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import mysql from "mysql2/promise"
import getConfig from "../util/config-fetcher"


const DB_CONFIG = {
  host: getConfig("database:host"),
  user: getConfig("database:username"),
  password: getConfig("database:password"),
  database: getConfig("database:name"),
  dateStrings: true
}

class Model {
  constructor() {
    this.conn = undefined
  }

  connect = async () => {
    this.conn = await mysql.createConnection(DB_CONFIG)
  }

  disconnect = () => {
    this.conn.end()
  }
}

export default Model