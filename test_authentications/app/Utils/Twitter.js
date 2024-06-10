// This is the Express server that will handle OAuth flow
// and will receive the access token from Twitter
// and will also be responsible for fetching the user's followers
// and will be used by the client to make requests to Twitter API
//
// The server is created to separate the logic of handling the OAuth flow
// and the logic of fetching the user's followers and to avoid
// potential security issues that can arise from mixing the two
//
// The server is also responsible for setting up CORS to allow
// the frontend to make requests to the server

const { Client, auth } = require("twitter-api-sdk");
const express = require("express");
const axios = require("axios");
// const dotenv = require("dotenv");
const cors = require("cors");
let accessToken = "";
// dotenv.config();

const app = express();
app.use(cors());

const authClient = new auth.OAuth2User({
  client_id: "ZURHVmZhM0FxYm0yWDZBNTZ6c2g6MTpjaQ",
  client_secret: "489DpfNasqqX5m3UnLSGyrE5968gCBB8EufXavIMKWGvxXujhY",
  callback: "http://localhost:5000/callback",
  scopes: ["tweet.read", "users.read"],
});

const client = new Client(authClient);

const STATE = "my-state";

app.get("/callback", async function (req, res) {
  try {
    const { code, state } = req.query;
    if (state !== STATE) return res.status(500).send("State isn't matching");
    accessToken = (await authClient.requestAccessToken(code)).token
      .access_token;
    console.log("AccessToken: " + JSON.stringify(accessToken));

    res.send(`
      <html>
      <body>
        <p>You have been authenticated with this platform. You can close the window now.</p>
        <script>
          // Pass the access token and status to the parent window
          window.opener.postMessage({ token: ${JSON.stringify(
            accessToken
          )}, status: "Login successful" }, "*");

          // Close the window after a delay
          setTimeout(() => {
            window.close();
          }, 3000); // 3 seconds delay
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", async function (req, res) {
  const authUrl = authClient.generateAuthURL({
    state: STATE,
    code_challenge_method: "s256",
  });
  console.log(authUrl);
  res.redirect(authUrl);
});

app.get("/tweets", async function (req, res) {
  const tweets = await client.tweets.findTweetById("20");
  res.send(tweets.data);
});

app.get("/revoke", async function (req, res) {
  try {
    const response = await authClient.revokeAccessToken();
    res.send(response);
  } catch (error) {
    console.log(error);
  }
});

app.post("/followers", async (req, res) => {
  try {
    // const { accessToken } = req.body;

    const userResponse = await axios.get("https://api.twitter.com/2/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userId = userResponse.data.data.id;
    console.log("User ID: " + userId);

    const response = await axios.get(
      `https://api.twitter.com/2/users/${userId}/followers`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.send(response.data.data);
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).send("Failed to fetch followers");
  }
});

app.use(
  cors({
    origin: "https://localhost:3000",
  })
);

app.listen(5000, () => {
  console.log(`Go here to login: http://localhost:5000/login`);
});