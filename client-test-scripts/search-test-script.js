/**
 * @fileoverview Test script to be used in search socket test page.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import getConfig from "../app/util/config-fetcher"
import hljs from "highlightjs"



const WSURL = `ws:${getConfig("server:host").replace("http://", "")}:${getConfig("server:port")}`



const QBETest = () => {
  const QBE = {
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

  const setQBEResult = (result) => {
    QBE.result.innerHTML = JSON.stringify(result, null, "   ")
    hljs.highlightBlock(QBE.result)
  }

  const setQBEMessage = (message) => {
    QBE.message.innerHTML = message
  }

  let startWS = undefined
  let watchWS = undefined

  QBE.endPoint.value = `${getConfig("server:host")}:${getConfig("server:port")}/search/qbe-operation`

  QBE.submit.onclick = async () => {

    const endPoint = QBE.endPoint.value
    const file = QBE.example.files[0]
    const videoId = parseInt(QBE.videoId.value)

    const postData = new FormData()
    postData.append("exampleFile", file)
    postData.append("videoId", videoId)
    postData.append("min", QBE.min.value)
    postData.append("begin", QBE.begin.value)
    postData.append("end", QBE.end.value)
    postData.append("userId", QBE.userId.value)


    const QBEPost = await fetch(endPoint, {
      method: "POST",
      body: postData
    })

    const QBEPostResult = await QBEPost.json()

    console.log(QBEPostResult)

    if (QBEPostResult.status) {
      startWS && startWS.close()

      startWS = new WebSocket(WSURL)

      const operationId = QBEPostResult.data.operationId

      startWS.onopen = function () {
        startWS.send(JSON.stringify({
          route: "start-qbe",
          data: { operationId }
        }))
      }

      startWS.onmessage = function (evt) {
        const startWSMessage = JSON.parse(evt.data)
        console.log(startWSMessage)
        if (startWSMessage.status) {
          watchWS && watchWS.close()

          watchWS = new WebSocket(WSURL)

          watchWS.onopen = function () {
            watchWS.send(JSON.stringify({
              route: "watch-qbe",
              data: { operationId }
            }))
          }

          watchWS.onmessage = async function (evt) {

            const watchWSMessage = JSON.parse(evt.data)

            console.log(watchWSMessage)


            if (watchWSMessage.status) {
              if (watchWSMessage.data.progress === 100) {
                const fetchQBEResult = await (await fetch(`${endPoint}?id=${operationId}`)).json()
                setQBEResult(fetchQBEResult)
              }
              else {
                setQBEResult(watchWSMessage)
              }
            }
            else {
              setQBEResult(watchWSMessage)
            }
          }

          watchWS.onclose = function () {
            setQBEMessage("Watch Connection is closed")
          }

        }
        else {
          setQBEResult(startWSMessage)
        }

      }

      startWS.onclose = function () {
        setQBEMessage("Start Connection is closed")
      }
    }
    else {
      setQBEResult(QBEPostResult)
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

  esf.endPoint.value = `${getConfig("server:host")}:${getConfig("server:port")}/search/esf`

  esf.submit.onclick = async () => {
    const endPoint = esf.endPoint.value
    const videoId = parseInt(esf.videoId.value)

    const result = await fetch(`${endPoint}?videoId=${videoId}`)

    const esfResult = await result.json()
    esf.message.innerHTML = "Extract Search Features respond is received:"
    esf.result.innerHTML = JSON.stringify(esfResult, null, "   ")

    if (esfResult.status) {
      const data = {
        videoId
      }

      ws && ws.close()

      ws = new WebSocket(`ws:${getConfig("server:host").replace("http://", "")}:${getConfig("server:port")}`)

      ws.onopen = function () {
        ws.send(JSON.stringify({ route: "watch-esf", data }))
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
}

document.addEventListener("DOMContentLoaded", () => {
  QBETest()
  esfTest()
})
