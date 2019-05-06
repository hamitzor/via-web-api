/**
 * @author doguhanbabuur@hotmail.com (Doğuhan Babur)
 */

import db from "../util/db-connection-pool"


  export default class ObjectDetectedModel {
    static fetchById(videoId) {
      return db.execute("SELECT detected_object_id AS o_ID, a.video_id, b.object_id, b.frame_no AS " +
      "'frameNo' , b.left_x 'left' , b.top_y AS 'top', width, height " +
      "FROM detected_objects a JOIN video_detected_objects b ON b.object_id = a.object_id "+
      "WHERE a.video_id = ? ", [videoId])
    }
}