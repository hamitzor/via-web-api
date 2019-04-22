/**
 * @author umutguler97@gmail.com (Göksen Umut Güler)
 */

import Logger from "../util/logger"
import AnomalyDetectedModel from "../models/anomaly-video-model"
import { spawn } from "child_process"

export const getAnomaliesByVideo = (req, res) => {
    const videoId = req.params.videoId
    AnomalyDetectedModel.fetchById(videoId)
      .then(([queryRows, queryFields]) => {
        res.status(200).json(...queryRows)
      })
      .catch(err => {
        res.status(400).json(err)
      })
  }