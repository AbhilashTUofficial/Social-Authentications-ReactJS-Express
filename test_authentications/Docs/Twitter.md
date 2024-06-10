# Twitter Authentication with React and Node.js

This guide will walk you through setting up Twitter authentication in a React application using a Node.js backend. The application will allow users to log in with their Twitter account, fetch their followers, and display them in the React app.

## Prerequisites
- Node.js and npm installed on your machine.
- Twitter Developer Account and a Twitter App set up.
- Basic knowledge of JavaScript, React, and Express.js.
- You need Basic tier Access to fetch Followers of related data, by default we only get Free tier Access.

## Step 1: Setting Up the Twitter Developer Account
1. Go to the Twitter Developer Portal.
2. Create a new project and a new app within that project.
3. Select Project → Settings → User authentication settings.
   1. Set Type of App to `Web App, Automated App Or Bot`
   2. Setu Callback URL / rEDIRECT URL to `http://localhost:5000/callback`.
   3. Set Website URL.
   4. Set up the OAuth 2.0 authentication settings with the callback URL: `http://localhost:5000/callback`
   
4. In your app Keys and tokens, find and copy the following credentials:
    - In OAuth 2.0 Client ID and Client Secret
    - Client ID and Client Secret
  

## Step 2: Setting Up the Backend Server
1. Create a new directory for your project and initialize a new Node.js project:
    ```bash
    mkdir twitter-auth-app
    cd twitter-auth-app
    npm init -y
    ```
2. Install the necessary packages:
    ```bash
    npm install express cors dotenv axios twitter-api-sdk
    ```
3. Create a `.env` file in the root directory and add your Twitter API credentials:
    ```makefile
    CLIENT_ID=your-twitter-api-key
    CLIENT_SECRET=your-twitter-api-secret-key
    ```
4. Create a `server.js` file and add the following code:
    ```javascript
    const { Client, auth } = require("twitter-api-sdk");
    const express = require("express");
    const cors = require("cors");
    const dotenv = require("dotenv");
    const axios = require("axios");

    dotenv.config();

    const app = express();

    // Use CORS middleware
    app.use(cors());
    app.use(express.json());

    const authClient = new auth.OAuth2User({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      callback: "http://localhost:5000/callback",
      scopes: ["tweet.read", "users.read", "follows.read"], // Added follows.read scope
    });

    const client = new Client(authClient);

    const STATE = "my-state";

    app.get("/login", (req, res) => {
      const authUrl = authClient.generateAuthURL({
        state: STATE,
        code_challenge_method: "s256",
      });
      res.redirect(authUrl);
    });

    app.get("/callback", async (req, res) => {
      try {
        const { code, state } = req.query;
        if (state !== STATE) return res.status(500).send("State isn't matching");
        await authClient.requestAccessToken(code);

        // Pass the access token to the frontend
        const accessToken = authClient.token.access_token;

        // Render a page with a message and script to close the window after a delay
        res.send(`
          <html>
          <body>
            <p>You have been authenticated with this platform. You can close the window now.</p>
            <script>
              // Pass the access token and status to the parent window
              window.opener.postMessage({ token: ${JSON.stringify(accessToken)}, status: "Login successful" }, "*");

              // Close the window after a delay
              setTimeout(() => {
                window.close();
              }, 3000); // 3 seconds delay
            </script>
          </body>
          </html>
        `);
      } catch (error) {
        console.error("Error during callback:", error);
        res.send(`
          <html>
          <body>
            <p>Authentication failed. You can close the window now.</p>
            <script>
              // Pass the error status to the parent window
              window.opener.postMessage({ status: "Authentication failed" }, "*");

              // Close the window after a delay
              setTimeout(() => {
                window.close();
              }, 3000); // 3 seconds delay
            </script>
          </body>
          </html>
        `);
      }
    });

    app.post("/followers", async (req, res) => {
      try {
        
        const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });
        const userId = userResponse.data.data.id;

        const response = await axios.get(`https://api.twitter.com/2/users/${userId}/followers`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });

        res.send(response.data.data);
      } catch (error) {
        console.error("Error fetching followers:", error);
        res.status(500).send("Failed to fetch followers");
      }
    });

    app.listen(5000, () => {
      console.log(`Server is running on http://localhost:5000`);
    });
    ```

## Step 3: Setting Up the React Client
1. Create a new React application in the `twitter-auth-app` directory:
    ```bash
    npx create-react-app client
    cd client
    ```
2. Install axios for making HTTP requests:
    ```bash
    npm install axios
    ```
3. Update `src/App.js` with the following code:
    ```javascript
    import React, { useEffect, useState } from "react";
    import axios from "axios";

    const App = () => {
      const [accessToken, setAccessToken] = useState(null);
      const [loginStatus, setLoginStatus] = useState(null);
      const [followers, setFollowers] = useState([]);

      useEffect(() => {
        const handleMessage = (event) => {
          if (event.origin !== "http://localhost:5000") return;

          const { token, status } = event.data;

          if (token) {
            setAccessToken(token);
            setLoginStatus(status);
          }
        };

        window.addEventListener("message", handleMessage);

        return () => {
          window.removeEventListener("message", handleMessage);
        };
      }, []);

      const handleLogin = () => {
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        window.open("http://localhost:5000/login", "_blank", `width=${width},height=${height},left=${left},top=${top}`);
      };

      const fetchFollowers = async () => {
        try {
          const response = await axios.post("http://localhost:5000/followers", {
            accessToken,
          });
          setFollowers(response.data);
        } catch (error) {
          console.error("Error fetching followers", error);
        }
      };

      return (
        <div>
          <button onClick={handleLogin}>Login with Twitter</button>
          {loginStatus && <p>{loginStatus}</p>}
          {accessToken && (
            <>
              <button onClick={fetchFollowers}>Check Followers</button>
              <ul>
                {followers.map((follower, index) => (
                  <li key={index}>{follower.name} (@{follower.username})</li>
                ))}
              </ul>
            </>
          )}
        </div>
      );
    };

    export default App;
    ```

## Step 4: Running the Application
1. Start the Backend Server:
    ```bash
    cd twitter-auth-app
    node server.js
    ```
2. Start the React Client:
    Open a new terminal window and run:
    ```bash
    cd twitter-auth-app/client
    npm start
    ```

## Conclusion
You have successfully set up Twitter authentication in a React application using a Node.js backend. Users can log in with their Twitter account, fetch their followers, and display them in the React app. This setup provides a solid foundation for further enhancements, such as additional Twitter API interactions or improved user interface elements.
