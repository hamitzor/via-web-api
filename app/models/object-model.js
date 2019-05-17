/**
 * @author doguhanbabuur@hotmail.com (Doğuhan Babur)
 */

import db from "../util/db-connection-pool"


  export default class ObjectDetectedModel {
    static fetchById(videoId) {
      return db.execute("SELECT label, a.object_id, detected_object_id, video_id,  b.object_id, frame_no AS " +
      "'frameNo' , left_x 'left' , top_y AS 'top', width, height " +
      "FROM objects a JOIN detected_objects b ON b.object_id = a.object_id  WHERE video_id = ? ", [videoId])
    }
}
