/**
 * @author umutguler97@gmail.com(Göksen Umut GÜLER)
 */

import fetchConfig from "../app/util/config-fetcher"
import hljs from "highlightjs"
import codes from "../app/util/status-codes"



const WSURL = `ws:${fetchConfig("server:host").replace("http://", "")}:${fetchConfig("server:port")}`
const endPoint = `${fetchConfig("server:host")}:${fetchConfig("server:port")}`


const anomalyTest = () => {
	  const anomaly = {
		      videoId: document.getElementById("anomaly-video-id"),
		      submit: document.getElementById("anomaly-submit"),
		      terminate: document.getElementById("anomaly-terminate"),
		      message: document.getElementById("anomaly-message"),
		      result: document.getElementById("anomaly-result"),
		    }

	  const setanomalyResult = (result) => {
		      anomaly.result.innerHTML = JSON.stringify(result, null, "   ")
		      hljs.highlightBlock(anomaly.result)
		    }

	  const setanomalyMessage = (message) => {
		      anomaly.message.innerHTML = message
		    }

	  let startWS = undefined

	  let results = []


	  anomaly.submit.onclick = async () => {

		      results = []

		      

		        startWS && startWS.close()

		        startWS = new WebSocket(WSURL)

		        startWS.onopen = function () {
				        startWS.send(JSON.stringify({
						          route: "start-anomaly-crowd",
						          data: {
								              videoId: parseInt(anomaly.videoId.value)
								            }
						        }))
				      }

		        startWS.onmessage = function (evt) {
				        let watchWS = undefined
				        const startM = JSON.parse(evt.data)
				        console.log(evt.data)

				        anomaly.terminate.onclick = async () => {
						          await (await fetch(`${endPoint}/query/terminate-operation/${startM.data.operationId}`)).json()
						        }

				        const startStatus = startM.status
				        /* eslint-disable */
				        switch (startStatus) {
						          case codes.INTERNAL_SERVER_ERROR:
							            console.log(startM)
							            break;
							          case codes.COMPLETED_SUCCESSFULLY:
							            setanomalyMessage("Completed")
							            break;
							          case codes.OK:
							            watchWS && watchWS.close()

							            watchWS = new WebSocket(WSURL)

							            watchWS.onopen = function () {
									                  watchWS.send(JSON.stringify({
												                  route: "anomaly-watch-operation",
												                  data: { operationId: startM.data.operationId }
												                }))
									                }

							            watchWS.onmessage = async function (evt) {
									                  console.log(evt.data)
									                  const watchM = JSON.parse(evt.data)
									                  const watchStatus = watchM.status
									                  setanomalyResult(watchM)
									                  switch (watchStatus) {
												                  case codes.PROGRESS:
													                    setanomalyResult({ progress: watchM.data.progress, results: results })
													                    break;
													                  default:
													                    console.log(watchM)
													                }
									                }
							            watchWS.onclose = function () {
									                  setanomalyMessage("Watch Connection is closed")
									                }
							            break;
							          default:
							            console.log(startM)
							            break;
							        }
				        /* eslint-enable */
				      }
		        startWS.onclose = function () {
				        setanomalyMessage("Start Connection is closed")
				      }
		      

		    }
}



document.addEventListener("DOMContentLoaded", () => {
	  anomalyTest()
})

