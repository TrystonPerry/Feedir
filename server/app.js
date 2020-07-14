require("dotenv").config()
const cors = require("cors")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const twitter = require("twitter")
const fetch = require("node-fetch")
const request = require("request")
const qs = require("querystring")
const crypto = require("crypto")

const client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: "",
  access_token_secret: ""
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))

function getTimestamp() {
  return Math.floor(Date.now() / 1000)
}

function getNonce() {
  return crypto.randomBytes(32).toString("base64")
}

function getSignature(method, baseUrl, params, oauth_token_secret = "") {
  
  // Get all param keys and sort alphabetically
  const paramArr = Object.keys(params).sort()
  
  let str = ""
  const encode = encodeURIComponent

  // Percent encode all params key and values
  for (let i = 0; i < paramArr.length; i++) {
    str += encode(paramArr[i]) + "=" + encode(params[paramArr[i]])
    if (i < paramArr.length - 1) str += "&"
  }

  console.log(`${str}\n\n`)

  str = `${method}&${encode(baseUrl)}&${encode(str)}`

  console.log(`${str}\n\n`)

  const key = `${encode(process.env.TWITTER_CONSUMER_SECRET)}&${encode(oauth_token_secret)}`
  const sig = crypto.createHmac("sha1", key).update(str).digest("base64")
  console.log(`${key}\n\n`)
  console.log(`${sig}\n\n`)

  return sig
}

function getAuthHeader(params) {
  const keys = Object.keys(params)

  let str = "Oauth "
  const encode = encodeURIComponent
  for (let i = 0; i < keys.length; i++) {
    str += `${encode(keys[i])}="${encode(params[keys[i]])}"`
    if (i < keys.length - 1) str += ", "
  }

  console.log(str)
  return str
}


// ROUTES
app.get("/api/test", async (req, res) => {
  const method = "POST"
  const baseUrl = "https://api.twitter.com/oauth/request_token"
  
  const params = {
    oauth_callback: "http://localhost:3000"
  }

  const oauth_params = {
    oauth_consumer_key: process.env.TWITTER_CONSUMER_KEY,
    oauth_nonce: getNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: getTimestamp(),
    oauth_version: "1.0"
  }

  const oauth_signature = getSignature(method, baseUrl, {
    ...params,
    ...oauth_params
  })

  const response = await fetch(baseUrl, {
    method,
    headers: {
      Authorization: getAuthHeader({ ...params, ...oauth_params, oauth_signature })
    }
  })

  console.log(response)

  res.send(oauth_signature)
})

// LISTEN
app.listen(process.env.PORT, process.env.IP, () => {
  console.log(`Follow0 server started on http://${process.env.IP}:${process.env.PORT}`)
})