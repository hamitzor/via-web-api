window.SEARCH_ROOT = document.createElement("DIV")

const openTest = () => {

  //CREATE TEST ELEMENTS
  const endPointInput = document.createElement("INPUT")
  endPointInput.placeholder = "Endpoint URL"
  endPointInput.value = "localhost:8080"
  const br = document.createElement("BR")
  const fileInput = document.createElement("INPUT")
  fileInput.type = "file"
  const numberInput = document.createElement("INPUT")
  numberInput.type = "number"
  numberInput.value = 1
  const submitQueryByExample = document.createElement("BUTTON")
  submitQueryByExample.innerHTML = "Search API - Test Query by Example"
  const pre = document.createElement("PRE")
  const code = document.createElement("CODE")
  pre.appendChild(code)
  const message = document.createElement("h4")
  window.SEARCH_ROOT.appendChild(br.cloneNode())
  window.SEARCH_ROOT.appendChild(endPointInput)
  window.SEARCH_ROOT.appendChild(br.cloneNode())
  window.SEARCH_ROOT.appendChild(br.cloneNode())
  window.SEARCH_ROOT.appendChild(numberInput)
  window.SEARCH_ROOT.appendChild(br.cloneNode())
  window.SEARCH_ROOT.appendChild(br.cloneNode())
  window.SEARCH_ROOT.appendChild(fileInput)
  window.SEARCH_ROOT.appendChild(br.cloneNode())
  window.SEARCH_ROOT.appendChild(br.cloneNode())
  window.SEARCH_ROOT.appendChild(submitQueryByExample)
  window.SEARCH_ROOT.appendChild(message)
  window.SEARCH_ROOT.appendChild(pre)
  document.body.appendChild(window.SEARCH_ROOT)
  //CREATE TEST ELEMENTS


  submitQueryByExample.onclick = () => {
    const endPoint = endPointInput.value
    const file = fileInput.files[0]
    const filePath = fileInput.value
    const videoId = parseInt(numberInput.value)
    const reader = new FileReader()
    reader.onloadend = function () {

      const data = {
        videoId,
        base64Image: reader.result
      }

      const ws = new WebSocket(`ws:${endPoint}`)

      ws.onopen = function () {
        ws.send(JSON.stringify(data))
        message.innerHTML = `Query by Example request sent with parameters videoId = ${videoId} image = ${filePath} waiting for response...`
        code.innerHTML = ""
      }

      ws.onmessage = function (evt) {
        message.innerHTML = "Query by Example respond is received:"
        code.innerHTML = JSON.stringify(JSON.parse(evt.data), null, "\t")
        document.querySelectorAll("pre code").forEach((block) => {
          hljs.highlightBlock(block)
        })
      }

      ws.onclose = function () {
        message.innerHTML = "Connection is closed"
      }
    }
    reader.readAsDataURL(file)
  }
}

const closeTest = () => {
  document.body.removeChild(window.SEARCH_ROOT)
  window.SEARCH_ROOT = document.createElement("DIV")
}


const searchTest = () => {
  const toggleSearchTest = document.createElement("BUTTON")
  toggleSearchTest.innerHTML = "Toggle Search Tests"
  toggleSearchTest.onclick = () => {
    if (!window.SEARCH_TOGGLED) {
      window.SEARCH_TOGGLED = true
      openTest()
    }
    else {
      window.SEARCH_TOGGLED = false
      closeTest()
    }
  }
  document.body.appendChild(toggleSearchTest)

}

export default searchTest