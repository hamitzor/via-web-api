/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

import fetchConfig from "../app/util/config-fetcher"
import hljs from "highlightjs"
import codes from "../app/util/status-codes"



const WSURL = `ws:${fetchConfig("server:host").replace("http://", "")}:${fetchConfig("server:port")}`
const endPoint = `${fetchConfig("server:host")}:${fetchConfig("server:port")}`


const QBETest = () => {
  const QBE = {
    videoId: document.getElementById("qbe-video-id"),
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


  QBE.submit.onclick = async () => {

    results = []

    const reader = new FileReader()

    reader.onloadend = function () {

      startWS && startWS.close()

      startWS = new WebSocket(WSURL)

      startWS.onopen = function () {
        startWS.send(JSON.stringify({
          route: "start-qbe",
          data: {
            videoId: parseInt(QBE.videoId.value),
            encodedImage: reader.result,
            min: QBE.min.value ? parseFloat(QBE.min.value) : undefined,
            begin: QBE.begin.value ? parseInt(QBE.begin.value) : undefined,
            end: QBE.end.value ? parseInt(QBE.end.value) : undefined,
          }
        }))
      }

      startWS.onmessage = function (evt) {
        let watchWS = undefined
        const startM = JSON.parse(evt.data)


        QBE.terminate.onclick = async () => {
          await (await fetch(`${endPoint}/query/terminate-operation/${startM.data.operationId}`)).json()
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
                route: "watch-operation",
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

const EQFTest = () => {
  const EQF = {
    videoId: document.getElementById("eqf-video-id"),
    submit: document.getElementById("eqf-submit"),
    terminate: document.getElementById("eqf-terminate"),
    message: document.getElementById("eqf-message"),
    result: document.getElementById("eqf-result")
  }

  const setEQFResult = (result) => {
    EQF.result.innerHTML = JSON.stringify(result, null, "   ")
    hljs.highlightBlock(EQF.result)
  }

  const setEQFMessage = (message) => {
    EQF.message.innerHTML = message
  }

  EQF.submit.onclick = async () => {
    let watchWS = undefined

    const startM = await (await fetch(`${endPoint}/query/start-eqf/${EQF.videoId.value}`)).json()

    EQF.terminate.onclick = async () => {
      await (await fetch(`${endPoint}/query/terminate-operation/${startM.data.operationId}`)).json()
    }

    const startStatus = startM.status
    /* eslint-disable */
    switch (startStatus) {
      case codes.INTERNAL_SERVER_ERROR:
        console.log(startM)
        break;
      case codes.COMPLETED_SUCCESSFULLY:
        setEQFMessage("Completed")
        break;
      case codes.OK:
        watchWS && watchWS.close()

        watchWS = new WebSocket(WSURL)

        watchWS.onopen = function () {
          watchWS.send(JSON.stringify({
            route: "watch-operation",
            data: { operationId: startM.data.operationId }
          }))
        }

        watchWS.onmessage = async function (evt) {

          const watchM = JSON.parse(evt.data)
          const watchStatus = watchM.status
          setEQFResult(watchM)
          switch (watchStatus) {
            case codes.PROGRESS:
              setEQFResult({ progress: watchM.data.progress })
              break;
            default:
              console.log(watchM)
          }
        }
        watchWS.onclose = function () {
          setEQFMessage("Watch Connection is closed")
        }
        break;
      default:
        console.log(startM)
        break;
    }
    /* eslint-enable */

  }
}


document.addEventListener("DOMContentLoaded", () => {
  QBETest()
  EQFTest()
})
