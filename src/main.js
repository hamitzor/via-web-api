import "@babel/polyfill"
import "source-map-support/register"
import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import compression from "compression"
import path from "path"
import SearchSocket from "./socket/search-socket"
import config from "../app.config"

const app = express()
const port = config.server.port
const domain = config.server.domain


app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname)))

new SearchSocket(config.socket.search).start()

app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../client-test-pages/home.html"))
})

app.get("/test", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../client-test-pages/test-page-home.html"))
})

app.get("/test/search-test", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../client-test-pages/test-page-search.html"))
})

app.listen(port, () => {
  console.log(`Application is online at ${domain}:${port}`)
})