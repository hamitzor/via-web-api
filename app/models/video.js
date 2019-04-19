/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import db from "../util/database"

export default class Video {
  static fetchAll() {
    return db.execute("SELECT * FROM videos")
  }

  static fetchById(videoId) {
    return db.execute("SELECT * FROM `videos` WHERE video_id = ?", [videoId])
  }

  static deleteById(videoId) {
    return db.execute("DELETE FROM `videos` WHERE video_id = ?", [videoId])
  }
}
