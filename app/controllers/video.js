/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import Video from "../models/video"

export const getVideos = (req, res) => {
  Video.fetchAll()
    .then(([queryRows, queryFields]) => {
      //queryRows is array of Objects
      //queryFields is metaData about returned table
      console.log(queryRows)
    })
    .catch(err => {
      console.log(err)
    })
}

export const getVideo = (req, res) => {
  const videoId = req.params.videoId
  Video.fetchById(videoId)
    .then(([queryRows, queryFields]) => {
      console.log(queryRows)
    })
    .catch(err => {
      console.log(err)
    })
}

export const postVideo = (req, res) => {
  const VideoId = req.params.VideoId
  const CreationDate = req.params.CreationDate
  const Title = req.params.Title
  const Length = req.params.Length
  const Format = req.params.Format
  const Name = req.params.Name
  const Size = req.params.Size
  const Path = req.params.Path
  const FPS = req.params.FPS
  const TotalFrame = req.params.TotalFrame
  const Width = req.params.Width
  const Height = req.params.Height
  const video = new Video(
    VideoId,
    CreationDate,
    Title,
    Length,
    Format,
    Name,
    Size,
    Path,
    FPS,
    TotalFrame,
    Width,
    Height
  )

  video
    .save()
    .then(() => {
      console.log("New video saved")
    })
    .catch(err => {
      console.log("Error:",err)
    })
}

export const deleteVideo = (req, res) => {
  const videoId = req.params.videoId
  Video.deleteById(videoId)
    .then(([queryRows, queryFields]) => {
      console.log("Deleted")
    })
    .catch(err => {
      console.log(err)
    })
}

export const updateVideo = (req, res) => {}
