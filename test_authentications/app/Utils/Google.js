// server.js
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
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
