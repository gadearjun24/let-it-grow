"use strict";

const dotenv = require("dotenv");
dotenv.config();

const { join } = require("path");
const express = require("express");
const createError = require("http-errors");
const connectMongo = require("connect-mongo");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const logger = require("morgan");
const mongoose = require("mongoose");

const serveFavicon = require("serve-favicon");

const deserializeUser = require("./middleware/deserialize-user");
const bindUserToViewLocals = require("./middleware/bind-user-to-view-locals.js");

const cors = require("cors");

const authenticationRouter = require("./routes/authentication");
const openFarmRouter = require("./routes/openfarm");
const gardenRouter = require("./routes/garden");
const plantsRouter = require("./routes/plants");
const tasksRouter = require("./routes/tasks");

const app = express();

// Trust the first proxy (to handle load balancers or reverse proxies)
app.set("trust proxy", 1);

// Serve the favicon for the app
app.use(serveFavicon(join(__dirname, "public/images", "favicon.ico")));

// Logger middleware to log HTTP requests
app.use(logger("dev"));

// CORS middleware to enable cross-origin requests
app.use(
  cors({
    origin: "*", // Ensure this matches your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Methods you want to allow
    allowedHeaders: ["Content-Type", "Authorization"], // Headers you want to allow
    credentials: true, // Enable cookies to be sent with the requests
  })
);
// Body parser middleware to handle JSON requests
app.use(express.json());

// Cookie parser to read cookies from requests
app.use(cookieParser());

// Session middleware to handle user sessions with MongoDB as the store
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || "ss", // Session secret (should be in environment variable)
    resave: true, // Force session to be saved
    saveUninitialized: false, // Do not save empty sessions
    cookie: {
      maxAge: 60 * 60 * 24 * 15, // 15 days cookie expiry
      sameSite: "none", // Necessary for cross-site cookie use (important for browsers like Chrome)
      httpOnly: true, // Ensure cookie is only accessible via HTTP (not client-side JavaScript)
      secure: true, // Ensure cookie is sent over HTTPS (requires HTTPS)
    },
    store: new (connectMongo(expressSession))({
      mongooseConnection: mongoose.connection, // Use MongoDB to store sessions
      ttl: 60 * 60 * 24, // Session expiration time (1 day)
    }),
  })
);

// Middleware to deserialize the user (attach user data to request)
app.use(deserializeUser);

// Middleware to bind user data to view locals (for rendering in views)
app.use(bindUserToViewLocals);

// Route handlers for different endpoints
app.use("/authentication", authenticationRouter);
app.use("/search", openFarmRouter);
app.use("/garden", gardenRouter);
app.use("/plants", plantsRouter);
app.use("/tasks", tasksRouter);

// Catch-all route handler for undefined paths
app.use("*", (request, response, next) => {
  const error = new Error("Page not found.");
  next(error); // Pass error to error handler
});

// General error handler
app.use((error, request, response, next) => {
  response.status(400);
  response.json({ error: { message: error.message } });
});

module.exports = app; // Export app for use in server.js
