/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import crypto from "crypto"
import fs from "fs"
import fetchConfig from "../util/config-fetcher"
import path from "path"

const saveBase64Image = (image) => {
  return new Promise((resolve, reject) => {
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

    if (matches.length !== 3) {
      reject(new Error("Invalid input string"))
    }

    // Decode base64 content
    const content = Buffer.from(matches[2], "base64")

    // Extract "jpeg" from "image/jpeg"
    const type = (matches[1].match(/\/(.*?)$/))[1]

    const name = crypto.randomBytes(8).toString("hex")
    const directory = fetchConfig("temporary-directory")

    const savePath = path.resolve(directory, `${name}.${type}`)

    // Save image to disk
    fs.writeFile(savePath, content, (err) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(savePath)
      }
    })
  })
}

export default saveBase64Image