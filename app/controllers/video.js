/**
 * @author kgnugur@gmail.com (Kagan Ugur)
 */

import Video from "../models/video"
import formidable from "formidable"
import util from "util"

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
  const form = new formidable.IncomingForm()

  form.parse(req, (err, fields, files) => {
    res.writeHead(200, { "content-type": "text/plain" })
    res.write("received upload:\n\n")
    res.end(util.inspect({ fields: fields, files: files }))
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
