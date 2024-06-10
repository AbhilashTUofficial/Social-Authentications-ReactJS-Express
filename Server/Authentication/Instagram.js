const express = require("express");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const https = require("https");
const InstagramStrategy = require("passport-instagram").Strategy;

// Read the SSL certificate and key
const options = {
  key: fs.readFileSync(path.join(__dirname, "./certificates/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "./certificates/cert.pem")),
};

const app = express();

// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Use the InstagramStrategy within Passport
passport.use(
  new InstagramStrategy(
    {
      clientID: "3546558948990019",
      clientSecret: "2b491578f96792969ece50e2f9d31c57",
      callbackURL: "https://localhost:5000/auth/instagram/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Here you would save the user's profile to your database
      return done(null, profile);
    }
  )
);

app.use(
  require("express-session")({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send('<a href="/auth/instagram">Log in with Instagram</a>');
});

app.get("/auth/instagram", passport.authenticate("instagram"));

app.get(
  "/auth/instagram/callback",
  passport.authenticate("instagram", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/profile");
  }
);

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(`Hello, ${req.user.username}!`);
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Start the server
const PORT = 5000;

const server = https.createServer(options, app);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
