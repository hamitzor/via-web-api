 /**
 * @author umutguler97@gmail.com (Göksen Umut Güler)
 */
 
 import AnomalyDetectedModel from "../models/anomaly-video-model"


 export const getAnomaliesByVideo = (req, res) => {
  const videoId = req.params.videoId
  AnomalyDetectedModel.fetchById(videoId)
  .then(([queryRows, queryFields]) => {
    res.status(200).json(queryRows)
  })
  .catch(err => {
    res.status(400).json(err)
  })
}


export const getLineCrossingDetectionByVideo = (req, res) => {
  const videoId = req.params.videoId
  AnomalyDetectedModel.fetchLineCrossingById(videoId)
  .then(([queryRows, queryFields]) => {
    res.status(200).json(queryRows)
  })
  .catch(err => {
    res.status(400).json(err)
  })
}