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
