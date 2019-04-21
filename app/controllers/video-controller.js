/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import VideoModel from "../models/video-model"

export const getVideos = (req, res) => {
  VideoModel.fetchAll()
    .then(([queryRows, queryFields]) => {
      res.status(200).json(queryRows)
    })
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
}

export const getVideo = (req, res) => {
  const videoId = req.params.videoId
  VideoModel.fetchById(videoId)
    .then(([queryRows, queryFields]) => {
      res.status(200).json(...queryRows)
    })
    .catch(err => {
      res.status(400).json(err)
    })
}

export const postVideo = (req, res) => {
  // console.log(req.file)
  // console.log(req.body)
}

export const deleteVideo = (req, res) => {
  const videoId = req.params.videoId
  VideoModel.deleteById(videoId)
    .then(([queryRows, queryFields]) => {
      res.status(200).json({
        message: `Post with id:${videoId} is deleted`
      })
    })
    .catch(err => {
      res.status(204).json(err)
    })
}
