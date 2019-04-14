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
    userId: document.getElementById("qbe-user-id"),
    example: document.getElementById("qbe-example"),
    submit: document.getElementById("qbe-submit"),
    message: document.getElementById("qbe-message"),
    result: document.getElementById("qbe-result"),
    min: document.getElementById("qbe-min"),
    begin: document.getElementById("qbe-begin"),
    end: document.getElementById("qbe-end"),
  }

  let ws = undefined

  qbe.endPoint.value = `${config.server.domain}:${config.server.port}/search/query-by-example`

  qbe.submit.onclick = async () => {

    const endPoint = qbe.endPoint.value
    const file = qbe.example.files[0]
    const filePath = qbe.example.value
    const videoId = parseInt(qbe.videoId.value)

    const postData = new FormData()
    postData.append("exampleFile", file)
    postData.append("videoId", videoId)
    postData.append("min", parseFloat(qbe.min.value))
    postData.append("begin", parseInt(qbe.begin.value))
    postData.append("end", parseInt(qbe.end.value))
    postData.append("userId", parseInt(qbe.userId.value))


    const result = await fetch(endPoint, {
      method: "POST",
      body: postData
    })
    const postQBEResult = await result.json()
    qbe.message.innerHTML = "Query by Example respond is received:"
    qbe.result.innerHTML = JSON.stringify(postQBEResult, null, "   ")
    hljs.highlightBlock(qbe.result)

    ws && ws.close()

    const WSdata = {
      searchOperationId: postQBEResult.searchOperationId,
    }

    ws = new WebSocket(`ws:${config.server.domain.replace("http://", "")}:${config.server.port}`)

    ws.onopen = function () {
      ws.send(JSON.stringify({ route: "watch-query-by-example", data: WSdata }))
      qbe.message.innerHTML = `Query by Example Watch request sent with parameters videoId = ${videoId} image = ${filePath} waiting for response...`
      qbe.result.innerHTML = ""
    }

    ws.onmessage = function (evt) {
      qbe.message.innerHTML = "Query by Example Watch respond is received:"
      const evtData = JSON.parse(evt.data)
      evtData.data.result = JSON.parse(evtData.data.result)
      qbe.result.innerHTML = JSON.stringify(evtData, null, "   ")
      hljs.highlightBlock(qbe.result)
    }

    ws.onclose = function () {
      qbe.message.innerHTML = "Connection is closed"
    }
  }
}


const esfTest = () => {
  const esf = {
    endPoint: document.getElementById("esf-end-point"),
    videoId: document.getElementById("esf-video-id"),
    submit: document.getElementById("esf-submit"),
    message: document.getElementById("esf-message"),
    result: document.getElementById("esf-result"),
  }

  let ws = undefined

  esf.endPoint.value = `${config.server.domain}:${config.server.port}/search/extract-search-features`

  esf.submit.onclick = async () => {
    const endPoint = esf.endPoint.value
    const videoId = parseInt(esf.videoId.value)

    const result = await fetch(`${endPoint}?videoId=${videoId}`)

    const esfResult = await result.json()
    esf.message.innerHTML = "Extract Search Features respond is received:"
    esf.result.innerHTML = JSON.stringify(esfResult, null, "   ")

    const data = {
      videoId
    }

    ws && ws.close()

    ws = new WebSocket(`ws:${config.server.domain.replace("http://", "")}:${config.server.port}`)

    ws.onopen = function () {
      ws.send(JSON.stringify({ route: "watch-extract-search-features", data }))
      esf.message.innerHTML = `Extract Search Features Watch request sent with parameters videoId = ${videoId} waiting for response...`
      esf.result.innerHTML = ""
    }

    ws.onmessage = function (evt) {
      esf.message.innerHTML = "Extract Search Features Watch respond is received:"
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
