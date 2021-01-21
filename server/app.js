require("dotenv").config();
const fs = require('fs');
const cors = require("cors");
const express = require("./express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const Twitter = require("twitter");
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(cors());

const formatBody = body => {
  const props = body.split("&");
  const obj = {};
  for (let i = 0; i < props.length; i++) {
    const keyAndValue = props[i].split("=");
    obj[keyAndValue[0]] = keyAndValue[1];
  }
  return obj;
};

app.use((req, res, next) => {
  // If API method
  if (/^\/api/.test(req.path)) {
    next();
    return;
  }

  // Check if static file matches path url
  const path = `${__dirname}/public/${req.path}`;

  // If static file exists, send it
  if (fs.existsSync(path)) {
    res.sendFile(path);
  }

  // If static file doesn't exist, assume it's a SPA url
  else {
    res.sendFile(`${__dirname}/public/index.html`);
  }
})

// ROUTES
app.post("/api/oauth/request_token", async (req, res) => {
  if (!req.body.callback) {
    res.error({}, "No callback url provided", 400);
    return;
  }

  request.post(
    {
      url: "https://api.twitter.com/oauth/request_token",
      oauth: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        callback: req.body.callback
      }
    },
    (err, resp, body) => {
      if (err) {
        res.error({}, err, 500);
        return;
      }

      body = formatBody(body);

      res.success(body);
    }
  );
});

app.post("/api/oauth/access_token", async (req, res) => {
  const { oauth_token, oauth_verifier } = req.body;

  if (!oauth_token || !oauth_verifier) {
    res.error({}, "No oauth_token or oauth_verifier provided", 400);
    return;
  }

  request.post(
    {
      url: `https://api.twitter.com/oauth/access_token?oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`,
      oauth: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET
      }
    },
    (err, resp, body) => {
      if (err) {
        res.error({}, err, 500);
        return;
      }

      body = formatBody(body);

      res.success(body);
    }
  );
});

app.post("/api/tweet", async (req, res) => {
  const tweets = req.body.tweets || [];

  if (!tweets.length) {
    res.error({}, "You didn't provide any tweets");
    return
  }

  const user = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: req.headers.oauth_token,
    access_token_secret: req.headers.oauth_token_secret
  });

  let lastTweetId = -1;
  for (let i = 0; i < tweets.length; i++) {
    await (new Promise((resolve, reject) => {
      const query = { status: tweets[i] };
      
      // If not first tweet
      if (i > 0 && lastTweetId > -1) {
        query.in_reply_to_status_id = lastTweetId.toString();
        console.log(lastTweetId);
      }

      user.post("statuses/update", query, (err, tweet, response) => {
        if (err) {
          console.error(err);
          res.error({}, err[0].message || "There was an unknown error with posting your Tweet(s)", 500);
          reject();
          return 
        }      

        lastTweetId = tweet.id_str;
        resolve();
      })
    }));
  }

  res.success({});
});

app.get("/api/user/:screen_name", async (req, res) => {
  const { screen_name } = req.params;

  if (!screen_name || !screen_name.length) {
    res.error({}, "No screen_name provided");
    return
  }

  const user = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: req.headers.oauth_token,
    access_token_secret: req.headers.oauth_token_secret
  });

  user.get("users/show", { screen_name }, (err, user, response) => {
    if (err) {
      console.error(err);
      res.error({}, "Error getting user by screen_name", 500);
      return 
    }
    res.success(user);
  })
})

// LISTEN
app.listen(process.env.PORT, process.env.IP, () => {
  console.log(
    `Follow0 server started on http://${process.env.IP}:${process.env.PORT}`
  );
});
