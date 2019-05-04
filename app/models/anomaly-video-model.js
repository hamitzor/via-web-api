/**
 * @author umutguler97@gmail.com (Göksen Umut Güler)
 */

import db from "../util/db-connection-pool"

export default class AnomalyDetectedModel {
  static fetchById(videoId) {
    return db.execute("SELECT anomaly_id as ID, video_id, rule_id,frame_no as frameNo, left_x as left, top_y as top,width,height,related_function_name FROM video_detected_anomaly a JOIN detected_anomalies b ON b.detected_anomaly_id = a.detected_anomaly_id JOIN anomalies c ON b.rule_id=c.anomaly_id WHERE a.video_id = ?", [videoId])
  }
}
