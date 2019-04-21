/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import VideoModel from "../models/video-model"
import path from "path"
import { spawn } from "child_process"

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
  const scripPath = path.join(
    __dirname,
    "/../../helpers/extract_video_meta_data.py"
  )

  const subprocess = spawn("python", ["-u", scripPath, req.file.path])

  // print output of script
  subprocess.stdout.on("data", data => {
    console.log(data)
  })
  subprocess.stderr.on("data", data => {
    console.log(`error:${data}`)
  })
  subprocess.stderr.on("close", () => {
    console.log("Closed")
  })
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
