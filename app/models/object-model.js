/**
 * @author doguhanbabuur@hotmail.com (Doğuhan Babur)
 */

import db from "../util/db-connection-pool"


  export default class ObjectDetectedModel {
    static fetchById(videoId) {
      return db.execute("SELECT detected_object_id AS o_ID, video_id, object_id, frame_no AS " +
      "'frameNo' , left_x 'left' , top_y AS 'top', width, height " +
      "FROM detected_objects  WHERE video_id = ? ", [videoId])
    }
}