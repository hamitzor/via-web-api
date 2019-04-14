/**
 * @fileoverview Test script to be used in search socket test page.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import config from "../app.config"
import hljs from "highlightjs"

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

  qbe.endPoint.value = `${config.server.domain.replace("http://", "")}:${config.server.port}`

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
        ws.send(JSON.stringify({ route: "search-query-by-example", data }))
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


const esfTest = () => {
  const esf = {
    endPoint: document.getElementById("esf-end-point"),
    videoId: document.getElementById("esf-video-id"),
    submit: document.getElementById("esf-submit"),
    message: document.getElementById("esf-message"),
    result: document.getElementById("esf-result"),
    begin: document.getElementById("esf-begin"),
    end: document.getElementById("esf-end"),
  }

  let ws = undefined

  esf.endPoint.value = `${config.server.domain.replace("http://", "")}:${config.server.port}`

  esf.submit.onclick = () => {

    ws && ws.close()

    const endPoint = esf.endPoint.value
    const videoId = parseInt(esf.videoId.value)

    const data = {
      videoId,
      begin: parseInt(esf.begin.value),
      end: parseInt(esf.end.value)
    }

    ws = new WebSocket(`ws:${endPoint}`)

    ws.onopen = function () {
      ws.send(JSON.stringify({ route: "search-extract-search-features", data }))
      esf.message.innerHTML = `Extract Search Features request sent with parameters videoId = ${videoId} waiting for response...`
      esf.result.innerHTML = ""
    }

    ws.onmessage = function (evt) {
      esf.message.innerHTML = "Extract Search Features respond is received:"
      esf.result.innerHTML = JSON.stringify(JSON.parse(evt.data), null, "   ")
      hljs.highlightBlock(esf.result)
    }

    ws.onclose = function () {
      esf.message.innerHTML = "Connection is closed"
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  qbeTest()
  esfTest()
})
