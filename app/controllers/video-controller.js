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
  const extension = filename => {
    const index = file.originalname.indexOf(".")
    return file.originalname.substring(index)
  }

  // const title = req.body.title
  // const length = data.length
  // const extension = extension(req.file.filename)
  // const name = req.file.originalname
  // const size = req.file.size
  // const path = req.file.path
  // const fps = data.fps
  // const frame_count = data.total_frame
  // const width = data.width
  // const height = data.height
  // const esf_status = 1

  const scripPath = path.join(
    __dirname,
    "/../../helpers/extract_video_meta_data.py"
  )
  const subprocess = spawn("python", ["-u", scripPath, req.file.path])

  subprocess.stdout.on("data", data => {
    const data = JSON.parse(data)
    VideoModel.postVideo(
      req.body.title,
      data.length,
      extension(req.file.filename),
      req.file.originalname,
      req.file.size,
      req.file.path,
      data.fps,
      data.total_frame,
      data.width,
      data.height,
      1
    )
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
