// const https = require("https");
// const fs = require("fs");
// const path = require("path");
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// // Read the SSL certificate and key
// const options = {
//   key: fs.readFileSync(path.join(__dirname, "./certificates/key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "./certificates/cert.pem")),
// };

// const app = express();
// const port = 5000;
// const APP_ID = "1804827466666470";
// const APP_SECRET = "f5ea66bff38d54470ac4f9a3137443ee";
// const REDIRECT_URI = "https://localhost:5000/callback";

// function getFacebookAuthUrl(appId, redirectUri, state, scope) {
//   // const baseUrl = "https://www.facebook.com/v20.0/dialog/oauth";
//   // const params = {
//   //   client_id: appId,
//   //   redirect_uri: redirectUri,
//   //   state: state,
//   //   scope: scope.join(","),
//   // };
//   // const queryString = require("querystring");
//   // const authUrl = `${baseUrl}?${queryString.stringify(params)}`;
//   // return authUrl;
//   return "https://www.facebook.com/v20.0/dialog/oauth?response_type=token&display=popup&client_id=1804827466666470&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com";
// }

// app.get("/hello", (req, res) => {
//   res.send("Hello World!");
// });

// app.get("/login", async (req, res) => {
//   try {
//     const authUrl = getFacebookAuthUrl(APP_ID, REDIRECT_URI, "my-state", [
//       "email",
//       "public_profile",
//     ]);
//     console.log(authUrl);

//     res.redirect(authUrl);
//   } catch (error) {
//     console.error(error);
//   }
// });

// app.get("/callback", async function (req, res) {
//   try {
//     const { code } = req.query;
//     const response = await axios.get(
//       // `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`
//       "https://www.facebook.com/v20.0/dialog/oauth?response_type=token&display=popup&client_id=1804827466666470&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com"
//     );
//     const accessToken = response.data.access_token;
//     console.log("AccessToken: " + JSON.stringify(accessToken));
//     res.send(`
//       <html>
//       <body>
//         <p>You have been authenticated with this platform. You can close the window now.</p>
//         <script>
//           // Pass the access token and status to the parent window
//           window.opener.postMessage({ token: ${JSON.stringify(
//             accessToken
//           )}, status: "Login successful" }, "*");

//           // Close the window after a delay
//           setTimeout(() => {
//             window.close();
//           }, 3000); // 3 seconds delay
//         </script>
//       </body>
//       </html>
//     `);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("An error occurred");
//   }
// });

// app.use(
//   cors({
//     origin: "https://localhost:3000",
//   })
// );

// // Create the HTTPS server
// const server = https.createServer(options, app);

// // Start the server
// server.listen(port, () => {
//   console.log(`Example app listening at https://localhost:${port}`);
// });

"use client";
import React, { useEffect } from "react";

const FacebookSDKLoader = () => {
  useEffect(() => {
    // Function to initialize the Facebook SDK
    const initializeFacebookSDK = () => {
      window.fbAsyncInit = function () {
        FB.init({
          appId: "1804827466666470",
          cookie: true,
          xfbml: true,
          version: "v20.0",
        });

        FB.getLoginStatus(function (response) {
          console.log("Response: " + JSON.stringify(response));
        });
        FB.AppEvents.logPageView();
      };

      // Load the Facebook SDK script
      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    };

    // Initialize the SDK
    initializeFacebookSDK();
  }, []);

  return null;
};

export default FacebookSDKLoader;

export const loginWithFacebook = () => {
  return new Promise((resolve, reject) => {
    window.FB.login(
      (response) => {
        if (response.status === "connected") {
          resolve(response.authResponse.accessToken);
        } else {
          reject("User not logged in");
        }
      },
      { scope: "public_profile,email,user_friends,user_posts,user_photos" }
    );
  });
};

export const checkLoginStatus = () => {
  return new Promise((resolve, reject) => {
    window.FB.getLoginStatus((response) => {
      if (response.status === "connected") {
        resolve(response.authResponse.accessToken);
      } else {
        reject("User not logged in");
      }
    });
  });
};

export const logoutFromFacebook = (accessToken) => {
  return new Promise((resolve, reject) => {
    window.FB.api(
      "/me/permissions",
      "DELETE",
      { access_token: accessToken },
      (response) => {
        if (response.success) {
          resolve("Logout successful");
        } else {
          reject("Logout failed");
        }
      }
    );
  });
};

export const checkPermission = () => {
  return new Promise((resolve, reject) => {
    window.FB.api("/me", { fields: "permissions" }, (response) => {
      resolve(response.permissions.data);
    });
  });
};

export const fetchUserFriends = () => {
  return new Promise((resolve, reject) => {
    window.FB.api("/me", { fields: "friends{id,email}" }, (response) => {
      if (response && !response.error) {
        resolve(response.data);
      } else {
        reject("Failed to fetch user friends");
      }
    });
  });
};

export const fetchUserEmail = () => {
  return new Promise((resolve, reject) => {
    window.FB.api("/me", { fields: "email" }, (response) => {
      if (response && !response.error) {
        resolve(response.email);
      } else {
        reject("Failed to fetch user email");
      }
    });
  });
};

export const fetchUserPosts = () => {
  return new Promise((resolve, reject) => {
    window.FB.api(
      "/me",
      { fields: "posts{reactions,caption,description,message}" },
      (response) => {
        if (response && !response.error) {
          resolve(response.posts.data);
        } else {
          reject("Failed to fetch user Posts");
        }
      }
    );
  });
};
