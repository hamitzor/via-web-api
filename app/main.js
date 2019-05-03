/**
 * @author thenrerise@gmail.com (Hamit Zor)
 * @author kgnugur@gmail.com (Kagan Ugur)
 * @author umutguler97@gmail.com (Göksen Umut Güler)
 */

import "@babel/polyfill"
import "source-map-support/register"
import express from "express"
import { app, server } from "./core/create-express"
import cookieParser from "cookie-parser"
import { urlencoded } from "body-parser"
import compression from "compression"
import path from "path"
import cors from "cors"
import wss from "./wss/wss"
import fetchConfig from "./util/config-fetcher"
import videoRouter from "./routers/video-router"
import queryRouter from "./routers/query-router"
import homeRouter from "./routers/home-router"
import testRouter from "./routers/test-router"
import anomalyRouter from "./routers/anomaly-router"


const port = fetchConfig("server:port")
const domain = fetchConfig("server:host")

app.use(compression())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname)))
app.use(cors())
app.use("/static", express.static(path.join(__dirname, "/../../media-source/")))


app.use("/", homeRouter)

app.use("/test", testRouter)

app.use("/video", urlencoded({ extended: true }), videoRouter)

app.use("/query", queryRouter)

app.use("/anomaly", anomalyRouter)


server.listen(port, () => {
  console.log(`Application is online at ${domain}:${port}`)
})

wss.listen()
