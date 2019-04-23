/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import db from "../util/db-connection-pool"

class VideoModel {

  fetchAll = () => {
    const sql = "SELECT * FROM videos"
    return db.execute(sql)
  }

  fetchById = (videoId) => {
    const sql = "SELECT * FROM videos WHERE video_id = ?"
    return db.execute(sql, [videoId])
  }

  deleteById = (videoId) => {
    const sql = "DELETE FROM videos WHERE video_id = ?"
    return db.execute(sql, [videoId])
  }

  save = (video) => {
    const columns = Object.keys(video)
    const valuePlaceholders = Array(columns.length).fill("?")
    const values = columns.reduce((acc, column) => [...acc, video[column]], [])

    const sql = `INSERT INTO videos (${columns.join(", ")}) VALUES (${valuePlaceholders.join(", ")})`


    return db.execute(sql, values)
  }
}

export default (new VideoModel)
