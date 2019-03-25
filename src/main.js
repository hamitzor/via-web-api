import "@babel/polyfill"
import 'source-map-support/register'
import express from 'express'
import cookieParser from 'cookie-parser'
import api from './api_example'
import bodyParser from 'body-parser'
import compression from 'compression'

const app = express()
const port = 3000


app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', api)

app.get(/./, function (req, res) {
  res.send("VIA APP")
})

app.listen(port, () => {
  console.log(`Application is online at http://localhost:${port}`)
})