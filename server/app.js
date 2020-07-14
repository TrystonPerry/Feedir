require("dotenv").config()
const cors = require("cors")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const request = require("request")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))

// ROUTES
app.get("/api/test", async (req, res) => {
  const oauth = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    callback: "http://localhost:3000"
  }

  request.post({
    url: "https://api.twitter.com/oauth/request_token",
    oauth,
  }, (e, r, body) => {
    res.send(body)
  })
})

// LISTEN
app.listen(process.env.PORT, process.env.IP, () => {
  console.log(`Follow0 server started on http://${process.env.IP}:${process.env.PORT}`)
})