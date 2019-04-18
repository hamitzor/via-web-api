/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import Video from "../models/video"
import formidable from "formidable"

export const getVideos = (req, res) => {
  Video.fetchAll()
    .then(([queryRows, queryFields]) => {
      res.status(200).json(queryRows)
    })
    .catch(err => {
      console.log(err)
    })
}

export const getVideo = (req, res) => {
  const videoId = req.params.videoId
  Video.fetchById(videoId)
    .then(([queryRows, queryFields]) => {
      res.status(200).json(...queryRows)
    })
    .catch(err => {
      console.log(err)
    })
}

export const postVideo = (req, res) => {
  new formidable.IncomingForm()
    .parse(req)
    .on("field", (name, field) => {
      console.log("Field", name, field)
    })
    .on("file", (name, file) => {
      console.log("Uploaded file", name, file)
    })
    .on("aborted", () => {
      console.error("Request aborted by the user")
    })
    .on("error", err => {
      console.error("Error", err)
      throw err
    })
    .on("end", () => {
      res.status(201).json({
        message: "Post created succesfully"
      })
    })
}

export const deleteVideo = (req, res) => {
  const videoId = req.params.videoId
  Video.deleteById(videoId)
    .then(([queryRows, queryFields]) => {
      res.status(200).json({
        message: `Post with id:${videoId} is deleted`
      })
    })
    .catch(err => {
      console.log(err)
    })
}
