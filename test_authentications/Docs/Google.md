# Google Authentication with React and Node.js

This guide will walk you through setting up Google authentication in a React application using a Node.js backend. The application will allow users to log in with their Google account, fetch their profile data, and display it in the React app.

## Prerequisites
- Node.js and npm installed on your machine.
- Google Developer Account and a Google App set up.
- Basic knowledge of JavaScript, React, and Express.js.

## Step 1: Setting Up the Google Developer Account
1. Go to the Google Cloud Console.
2. Create a new project.
3. Enable the Google People API for your project.
4. Configure OAuth consent screen:
   - Choose User Type: External
   - Add the required scopes such as `openid`, `profile`, and `email`.
   - Add Authorized Domains and Redirect URIs.
5. Create OAuth 2.0 credentials:
   - Select Application Type: Web Application.
   - Add Authorized Redirect URIs (e.g., `http://localhost:5000/auth/google/callback`).
   - Copy the generated Client ID and Client Secret.
   - Note: Each App settings or any other updates could take 5min - 1 hours to take effect.
   - Important: Keep in mind you need to add the callback url to the app.

## Step 2: Setting Up the Backend Server
1. Create a new directory for your project and initialize a new Node.js project:
    ```bash
    mkdir google-auth-app
    cd google-auth-app
    npm init -y
    ```
2. Install the necessary packages:
    ```bash
    npm install express dotenv googleapis
    ```
3. Create a `.env` file in the root directory and add your Google API credentials:
    ```makefile
    CLIENT_ID=your-google-client-id
    CLIENT_SECRET=your-google-client-secret
    CALLBACK_URL=http://localhost:5000/auth/google/callback
    ```
4. Create a `server.js` file and add the provided code.
   ```javascript
    const express = require("express");
    const passport = require("passport");
    const GoogleStrategy = require("passport-google-oauth20").Strategy;
    const session = require("express-session");
    const { google } = require("googleapis");

    const app = express();
    let accessToken;

    // Passport configuration
    passport.use(
    new GoogleStrategy(
        {
        clientID:
            "1070682806897-ve3svh6f1sghe2fpbernp8igdjvilq5h.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:5000/auth/google/callback",
        },
        function (_accessToken, refreshToken, profile, done) {
        accessToken = _accessToken;
        // Use the profile information (mainly profile id) to check if the user is registered in your db
        // If the user is found, pass the profile to the done callback
        // If the user is not found, you might want to create a new user and then pass the profile to the done callback
        return done(null, profile);
        }
    )
    );

    // Serialize user into session
    passport.serializeUser((user, done) => {
    done(null, user);
    });

    // Deserialize user from session
    passport.deserializeUser((obj, done) => {
    done(null, obj);
    });

    // Express session
    app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
    })
    );

    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    // app.get("/", (req, res) => {
    //   res.send('<h1>Home</h1><a href="/auth/google">Authenticate with Google</a>');
    // });

    app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        // Successful authentication
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
        return req.accessToken;
    }
    );

    app.get("/profile", async (req, res) => {
    // Set up OAuth2Client
    const OAuth2Client = new google.auth.OAuth2(
        "1070682806897-ve3svh6f1sghe2fpbernp8igdjvilq5h.apps.googleusercontent.com",
        "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",
        "http://localhost:5000/auth/google/callback"
    );
    OAuth2Client.setCredentials({ access_token: accessToken });

    // Set API key
    const apiKey = "AIzaSyDA2jbNb0OsXstzhLkyXXGtRqKT895N3PI";
    try {
        const people = google.people({
        version: "v1",
        auth: OAuth2Client,
        });

        const me = await people.people.get({
        resourceName: "people/me",
        personFields: "names,emailAddresses,photos",
        });

        const profileData = me.data;
        console.log("Profile data: " + JSON.stringify(profileData));
        return { ...me.data };
    } catch (error) {
        res.send(`Error fetching profile data: ${error.message}`);
    }

    if (!req.isAuthenticated()) {
        console.log("User Not Authenticated");
    }
    });

    app.get("/logout", (req, res) => {
    req.session.destroy();
    //   req.logout((err) => {
    //     if (err) {
    //       return next(err);
    //     }
    //   });
    });

    const PORT = 5000;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

   ```

## Step 3: Setting Up the React Client
1. Create a new React application in the `google-auth-app` directory:
    ```bash
    npx create-react-app client
    cd client
    ```
2. Install axios for making HTTP requests:
    ```bash
    npm install axios
    ```
3. Update `src/App.js` with the provided code.
   ```javascript
   'use client'

    import React, { useState } from 'react'
    import CustomCard from '../Components/Card';

    import styles from "../page.module.css";
    import axios, { Axios } from 'axios';


    export default function page() {
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [userID, setUserID] = useState('');
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [picture, setPicture] = useState('');

        const handleLogin = async () => {
            try {

                window.open("http://localhost:5000/auth/google", '_blank', 'width=600,height=700');


            } catch (error) {
                console.error('Error initiating Google login', error);
            }
        };


        const handleLogout = async () => {
            try {

                var response = await axios.get('http://localhost:5000/logout');

            } catch (error) {
                console.error('logout error', error);
            }
        };

        const handleFetctUserData = async () => {
            try {

                var response = await axios.get('http://localhost:5000/profile');

            } catch (error) {
                console.error('Fetching user data error', error);
            }
        };

        return (
            <main className={styles.main}>
                <CustomCard >

                    <div className={styles.btnCont}>
                        <button className={styles.btn} onClick={handleLogin}>Login</button>
                        <button className={styles.btn} onClick={handleLogout}>Logout</button>
                        <button className={styles.btn} onClick={handleFetctUserData}>Fetch User Data</button>
                    </div>
                </CustomCard>
            </main>
        );
    }
   ```

## Step 4: Running the Application
1. Start the Backend Server:
    ```bash
    cd google-auth-app
    node server.js
    ```
2. Start the React Client:
    Open a new terminal window and run:
    ```bash
    cd google-auth-app/client
    npm start
    ```

## Conclusion
You have successfully set up Google authentication in a React application using a Node.js backend. Users can log in with their Google account, fetch their profile data, and display it in the React app. This setup provides a solid foundation for further enhancements, such as additional Google API interactions or improved user interface elements.

Feel free to adjust the instructions based on your specific project requirements and architecture.
