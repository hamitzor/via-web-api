import WebSocket from "ws"
import { exec } from "child_process"
import crypto from "crypto"
import fs from "fs"
import Logger from "../../util/Logger"


class SearchSocket {
  constructor(port) {
    this.port = port
    this.logger = new Logger("/var/log/via/search")
  }

  saveBase64Image = (image, callback) => {
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)

    if (matches.length !== 3) {
      callback(null, new Error("Invalid input string"))
    }

    // Decode base64 content
    const content = Buffer.from(matches[2], "base64")

    // Extract "jpeg" from "image/jpeg"
    const type = (matches[1].match(/\/(.*?)$/))[1]

    const name = crypto.randomBytes(64).toString("hex")
    const directory = "/tmp/"
    const path = `${directory}${name}.${type}`

    // Save image to disk
    fs.writeFile(path, content, (err) => {
      callback(path, err)
    })
  }

  start = () => {
    // Start socket on specified port
    const search_socket = new WebSocket.Server({ port: this.port })

    const onMessage = (ws, message) => {
      const data = JSON.parse(message)

      try {
        if (typeof data.videoId !== 'number') {
          ws.send(JSON.stringify({
            status: false,
            message: 'videoId is not valid'
          }), (err) => { this.logger.error(err) })
        }
        else {
          this.saveBase64Image(data.base64Image, (filePath, err) => {
            if (err) {
              this.logger.error(err)
            }
            else {
              const command = `via_search_query_by_example ${data.videoId} ${filePath} --min 0.1 --api`
              exec(command, (err, stdout, _) => {
                if (err) {
                  ws.send(JSON.stringify({
                    status: false,
                    message: 'Internal Server Error'
                  }), (err) => { this.logger.error(err) })

                  this.logger.error(err)
                }
                else {
                  ws.send(JSON.stringify({
                    status: true,
                    result: JSON.parse(stdout)
                  }), (err) => { this.logger.error(err) })
                }
              })
            }
          })
        }
      } catch (err) {
        this.logger.error(err)
      }
    }


    search_socket.on("connection", (ws) => {
      ws.on("message", (message) => {
        onMessage(ws, message)
      })
    })
  }
}

export default SearchSocket