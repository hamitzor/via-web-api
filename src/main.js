import "@babel/polyfill"
import "source-map-support/register"
import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import compression from "compression"
import path from "path"
import SearchSocket from "./socket/SearchSocket"
import config from "../app.config"

const app = express()
const port = config.server.port
const domain = config.server.domain


app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname)))

new SearchSocket(8080).start()

app.get("/", function (req, res) {
  res.send("<a style=\"font-size:1.5rem\" href=\"\/api\">API Test Page</a>")
})

app.get("/api", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../api-test.html"))
})

app.listen(port, () => {
  console.log(`Application is online at ${domain}:${port}`)
})