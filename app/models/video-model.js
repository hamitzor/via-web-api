/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import db from "../util/database"

export default class VideoModel {
  static fetchAll() {
    return db.execute("SELECT * FROM videos")
  }

  static fetchById(videoId) {
    return db.execute("SELECT * FROM `videos` WHERE video_id = ?", [videoId])
  }

  static deleteById(videoId) {
    return db.execute("DELETE FROM `videos` WHERE video_id = ?", [videoId])
  }

  static postVideo(...values) {
    const columns =
      "title, length, extension,  name, size, path, fps,  frame_count,  width,  height, esf_status"

    return db.execute(`INSERT INTO videos(${columns}) VALUES(${syntValues()})`)
  }
}
