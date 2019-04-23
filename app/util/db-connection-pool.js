/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import mysql from "mysql2"
import fetchConfig from "./config-fetcher"

const DBConfig = {
  host: fetchConfig("database:host"),
  user: fetchConfig("database:username"),
  password: fetchConfig("database:password"),
  database: fetchConfig("database:name"),
  dateStrings: true
}

const DBConnectionPool = mysql.createPool(DBConfig)

export default DBConnectionPool.promise()