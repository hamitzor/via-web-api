/**
 * @fileoverview Test script to be used in search socket test page.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import config from '../app.config'
import hljs from 'highlightjs'

const qbeTest = () => {
  const qbe = {
    endPoint: document.getElementById("qbe-end-point"),
    videoId: document.getElementById("qbe-video-id"),
    example: document.getElementById("qbe-example"),
    submit: document.getElementById("qbe-submit"),
    message: document.getElementById("qbe-message"),
    result: document.getElementById("qbe-result"),
    min: document.getElementById("qbe-min"),
    begin: document.getElementById("qbe-begin"),
    end: document.getElementById("qbe-end"),
  }

  let ws = undefined

  qbe.endPoint.value = `${config.server.domain.replace("http://", "")}:${config.socket.search}`

  qbe.submit.onclick = () => {

    ws && ws.close()

    const endPoint = qbe.endPoint.value
    const file = qbe.example.files[0]
    const filePath = qbe.example.value
    const videoId = parseInt(qbe.videoId.value)
    const reader = new FileReader()

    if (!file) {
      alert("Upload an example image!")
      return
    }


    reader.onloadend = function () {
      const data = {
        videoId,
        base64Image: reader.result,
        min: parseFloat(qbe.min.value),
        begin: parseInt(qbe.begin.value),
        end: parseInt(qbe.end.value)
      }

      ws = new WebSocket(`ws:${endPoint}`)

      ws.onopen = function () {
        ws.send(JSON.stringify(data))
        qbe.message.innerHTML = `Query by Example request sent with parameters videoId = ${videoId} image = ${filePath} waiting for response...`
        qbe.result.innerHTML = ""
      }

      ws.onmessage = function (evt) {
        qbe.message.innerHTML = "Query by Example respond is received:"
        qbe.result.innerHTML = JSON.stringify(JSON.parse(evt.data), null, "   ")
        hljs.highlightBlock(qbe.result)
      }

      ws.onclose = function () {
        qbe.message.innerHTML = "Connection is closed"
      }
    }
    reader.readAsDataURL(file)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  qbeTest()
})
