/**
 * @author umutguler97@gmail.com (Göksen Umut Güler)
 */

import db from "../util/db-connection-pool"

export default class AnomalyDetectedModel {
  static fetchById(videoId) {
    return db.execute("SELECT anomaly_id AS ID, a.video_id, b.rule_id, b.frame_no AS " +
    "'frameNo' , b.left_x 'left' , b.top_y AS 'top', width, height, related_function_name " +
    "FROM video_detected_anomaly a JOIN detected_anomalies b ON b.detected_anomaly_id = a.detected_anomaly_id "+
    "JOIN anomalies c ON b.rule_id=c.anomaly_id WHERE a.video_id = ? AND rule_id != 2 ORDER BY frameNO", [videoId])
  }

  static fetchLineCrossingById(videoId){
    return db.execute("SELECT anomaly_id AS ID, a.video_id, b.rule_id, b.frame_no AS 'frameNo' , b.left_x 'left' , b.top_y AS 'top', width, height, related_function_name, params FROM video_detected_anomaly a JOIN detected_anomalies b ON b.detected_anomaly_id = a.detected_anomaly_id JOIN anomalies c ON b.rule_id=c.anomaly_id WHERE a.video_id = ? AND rule_id = 2 ORDER BY frameNO", [videoId])
  }
}
