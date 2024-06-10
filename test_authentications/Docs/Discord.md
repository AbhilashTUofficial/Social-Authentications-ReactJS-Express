# Discord Authentication with React and Node.js
This guide will walk you through setting up Discord authentication in a React application using a Node.js backend. The application will allow users to log in with their Discord account, fetch their connections, and display them in the React app.

## Prerequisites
- Node.js and npm installed on your machine.
- Discord Developer Account and a Discord App set up.
- Basic knowledge of JavaScript, React, and Express.js.
## Step 1: Setting Up the Discord Developer Account
1. Go to the Discord Developer Portal.
2. Create a new application.
3. Navigate to the "OAuth2" section of your application.
   1. Under "OAuth2 URL Generator", set the following parameters:
Redirects: Add http://localhost:5000/auth/discord/callback.
   2. Scopes: Select identify, email, and connections.
   3. Under "OAuth2" > "General", note down the CLIENT_ID and CLIENT_SECRET.
## Step 2: Setting Up the Backend Server
1. Create a new directory for your project and initialize a new Node.js project:

```bash
yarn install express cors dotenv node-fetch passport passport-discord express-session
```
2. Create a .env file in the root directory and add your Discord API credentials:

    CLIENT_ID=your-discord-client-id
    CLIENT_SECRET=your-discord-client-secret
    SESSION_SECRET=your-session-secret
3. Create a server.js file and add the following code:
   1. Some data access need to be declared on scope, eg: scope: ["identify", "email", "connections"], "connections" for user friedslist.

```javascript

const express = require("express");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const session = require("express-session");

// Create an Express application
const app = express();

// Configure session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

const CLIENT_ID = "1248515108410363946";
const CLIENT_SECRET = "GaAMI1vf6Q5tssu-hs_j73yk4xo6mvv_";
const CALLBACK_URL = "http://localhost:5000/auth/discord/callback";
const DISCORD_API_URL = "https://discord.com/api/v10";
var accessToken;

// Configure the Discord strategy for use by Passport
passport.use(
  new DiscordStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: ["identify", "email", "connections"],
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user information to support persistent login sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Define the route for the home page
app.get("/", (req, res) => {
  res.send('<a href="/auth/discord">Log in with Discord</a>');
});

// Define the route for initiating Discord authentication
app.get("/auth/discord", passport.authenticate("discord"));

// Define the route for handling the OAuth2 callback
app.get(
  "/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    // res.redirect("/profile");
    accessToken = req.user.accessToken;

    console.log("accessToken: " + JSON.stringify(accessToken));
    res.send(`
    <html>
    <body>
      <p>You have been authenticated with this platform. You can close the window now.</p>
      <script>
        // Pass the access token and status to the parent window
        window.opener.postMessage({ token: ${JSON.stringify(
          req.accessToken
        )}, status: "Login successful" }, "*");

        // Close the window after a delay
        setTimeout(() => {
          window.close();
        }, 3000); // 3 seconds delay
      </script>
    </body>
    </html>
  `);
  }
);

// Define the route for displaying the user profile
app.get("/profile", async (req, res) => {
  if (!accessToken) {
    return res.status(400).send("Access token is required");
  }

  try {
    const response = await fetch(DISCORD_API_URL + "/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .send("Failed to fetch user data from Discord");
    }

    const userData = await response.json();
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Fetch user's connections
app.get("/connections", async (req, res) => {
  if (!accessToken) {
    return res.status(400).send("Access token is required");
  }

  try {
    const response = await fetch(DISCORD_API_URL + "/users/@me/connections", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("response: " + JSON.stringify(response));

    if (!response.ok) {
      return res
        .status(response.status)
        .send("Failed to fetch user connectins from Discord");
    }

    const userData = await response.json();
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Define the route for logging out
app.get("/logout", (req, res) => {
  req.logout((err) => {
    accessToken = null;
    if (err) {
      return next(err);
    }
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


```

## Step 3: Setting Up the React Client

1. Create a new React application in the 
   
```javascript
'use client'
import CustomCard from "../Components/Card";
import styles from "../page.module.css";
import { useState } from "react";

export default function page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userID, setUserID] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState('');

    const handleLogin = async () => {
        try {

            window.open("http://localhost:5000/auth/discord", '_blank', 'width=600,height=700');

        } catch (error) {
            console.error('Error initiating Discord login', error);
        }
    };

    const handleLogout = async () => {
        try {

            window.open("http://localhost:5000/logout", '_blank', 'width=600,height=700');

        } catch (error) {
            console.error('Error user logout', error);
        }
    };
    const handleFetchUserData = async () => {
        try {

            window.open("http://localhost:5000/profile", '_blank', 'width=600,height=700');

        } catch (error) {
            console.error('Error get user data', error);
        }
    }
    const handleFetchConnections = async () => {
        try {

            window.open("http://localhost:5000/connections", '_blank', 'width=600,height=700');

        } catch (error) {
            console.error('Error get user connections data', error);
        }
    }


    return (
        <main className={styles.main}>
            <CustomCard >

                <div className={styles.btnCont}>
                    <button className={styles.btn} onClick={handleLogin}>Login</button>
                    <button className={styles.btn} onClick={handleLogout}>Logout</button>
                    <button className={styles.btn} onClick={handleFetchUserData}>Fetch User Data</button>
                    <button className={styles.btn} onClick={handleFetchConnections}>Fetch Connections</button>


                </div>
            </CustomCard>
        </main>
    );
}

```


# Conclusion

You have successfully set up Discord authentication in a React application using a Node.js backend. Users can log in with their Discord account, fetch their connections, and display them in the React app. This setup provides a solid foundation for further enhancements, such as additional Discord API interactions or improved user interface elements.

