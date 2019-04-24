import multer from "multer"
import fetchConfig from "../util/config-fetcher"

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, fetchConfig("upload-directory:video"))
  },
  filename: function (_, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const limits = {
  fileSize: 100 * 1024 * 1024,
  files: 1
}

const fileFilter = (req, file, callback) => {
  const regex = /^video/
  if (!regex.test(file.mimetype)) {
    callback(new multer.MulterError())
  }
  else {
    callback(null, true)
  }
}


const videoUploader = multer({
  storage,
  limits,
  fileFilter
})

export default videoUploader.single("videoFile")