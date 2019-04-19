/**
 * @fileoverview Test script to be used in search socket test page.
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import getConfig from "../app/util/config-fetcher"
import hljs from "highlightjs"
import codes from "../app/util/status-codes"



const WSURL = `ws:${getConfig("server:host").replace("http://", "")}:${getConfig("server:port")}`



const QBETest = () => {
  const QBE = {
    endPoint: document.getElementById("qbe-end-point"),
    videoId: document.getElementById("qbe-video-id"),
    userId: document.getElementById("qbe-user-id"),
    example: document.getElementById("qbe-example"),
    submit: document.getElementById("qbe-submit"),
    terminate: document.getElementById("qbe-terminate"),
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

  let results = []

  QBE.endPoint.value = `${getConfig("server:host")}:${getConfig("server:port")}`

  QBE.submit.onclick = async () => {

    results = []

    const endPoint = QBE.endPoint.value

    const reader = new FileReader()

    reader.onloadend = function () {

      startWS && startWS.close()

      startWS = new WebSocket(WSURL)

      startWS.onopen = function () {
        startWS.send(JSON.stringify({
          route: "start-qbe",
          data: {
            userId: QBE.userId.value,
            videoId: parseInt(QBE.videoId.value),
            encodedImage: reader.result,
            min: parseInt(QBE.min.value),
            begin: parseInt(QBE.begin.value),
            end: parseInt(QBE.end.value),
          }
        }))
      }

      startWS.onmessage = function (evt) {
        let watchWS = undefined
        const startM = JSON.parse(evt.data)


        QBE.terminate.onclick = async () => {
          await (await fetch(`${endPoint}/search/terminate-qbe?operationId=${startM.data.operationId}`)).json()
        }

        const startStatus = startM.status
        /* eslint-disable */
        switch (startStatus) {
          case codes.INTERNAL_SERVER_ERROR:
            console.log(startM)
            break;
          case codes.COMPLETED_SUCCESSFULLY:
            setQBEMessage("Completed")
            break;
          case codes.OK:
            watchWS && watchWS.close()

            watchWS = new WebSocket(WSURL)

            watchWS.onopen = function () {
              watchWS.send(JSON.stringify({
                route: "watch-qbe",
                data: { operationId: startM.data.operationId }
              }))
            }

            watchWS.onmessage = async function (evt) {

              const watchM = JSON.parse(evt.data)
              const watchStatus = watchM.status
              setQBEResult(watchM)
              switch (watchStatus) {
                case codes.PROGRESS:
                  if (watchM.data.results.length) {
                    results.push(...watchM.data.results)
                  }
                  setQBEResult({ progress: watchM.data.progress, results: results })
                  break;
                default:
                  console.log(watchM)
              }
            }
            watchWS.onclose = function () {
              setQBEMessage("Watch Connection is closed")
            }
            break;
          default:
            console.log(startM)
            break;
        }
        /* eslint-enable */
      }
      startWS.onclose = function () {
        setQBEMessage("Start Connection is closed")
      }
    }

    reader.readAsDataURL(QBE.example.files[0])

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
