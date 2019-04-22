/**
 * @author umutguler97@gmail.com (Göksen Umut Güler)
 */

import db from "../util/database"

export default class AnomalyDetectedModel {
  static fetchById(videoId) {
    return db.execute("SELECT * FROM detected_anomalies WHERE detected_anomalies.detected_anomaly_id IN (SELECT video_detected_anomaly.detected_anomaly_id FROM `video_detected_anomaly` WHERE video_detected_anomaly.video_id = ?)", [videoId])
  }
}
