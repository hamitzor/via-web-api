/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import mysql from "mysql2"
import fetchConfig from "./config-fetcher"

const DB_CONFIG = {
  host: fetchConfig("database:host"),
  user: fetchConfig("database:username"),
  password: fetchConfig("database:password"),
  database: fetchConfig("database:name"),
  dateStrings: true
}

const DBConnectionPool = mysql.createPool(DB_CONFIG)

export default DBConnectionPool.promise()