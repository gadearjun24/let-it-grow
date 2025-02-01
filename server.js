// "use strict";

// Load environment variables from .env file
require("dotenv").config();

const debug = require("debug")("let-it-grow:server");
const app = require("./app"); // Import the app (from app.js)
const mongoose = require("mongoose"); // Import mongoose for DB connection

const PORT = parseInt(process.env.PORT, 10) || 8080; // Default to 8080 if PORT is not set in .env
const URI =
  "mongodb+srv://gadearjun24:qwerty123456@ac-kz1v8al-shard-00-00.efkaxtv.mongodb.net/Nursery?retryWrites=true&w=majority&ssl=true"; // MongoDB URI from environment variable

// Function to terminate the app gracefully
const terminate = (error) => {
  if (error) debug(error); // Log the error if one occurs
  const exitCode = error && error instanceof Error ? 1 : 0; // Exit code 1 for errors, 0 for success
  debug("Terminating node app.");
  mongoose.disconnect().finally(() => {
    // Disconnect from DB before exiting
    debug("Disconnected from database.");
    process.exit(exitCode); // Exit the process
  });
};

// Process Signals for graceful shutdown (SIGINT, SIGTERM, uncaughtException)
process.on("SIGINT", () => terminate());
process.on("SIGTERM", () => terminate());
process.on("uncaughtException", (error) => {
  debug("There was an uncaught exception.");
  terminate(error); // Terminate app on uncaught exceptions
});
process.on("unhandledRejection", (error) => {
  debug("There was an unhandled promise rejection.");
  terminate(error); // Terminate app on unhandled promise rejections
});

// Error handling when server encounters issues
const onError = (error) => {
  const { syscall, port, code } = error;
  if (syscall === "listen" && code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use`);
    process.exit(1); // Exit if port is already in use
  } else {
    console.error("There was an unknown error.");
    debug(error);
    throw error; // Throw error if unknown issue occurs
  }
};

// Callback for when the server starts listening
const onListening = (server) => {
  console.log("Server is running");

  const { port } = server.address();
  debug(`Node server listening on ${port}`); // Debug info about the server's port

  // If in development environment, show the development URL
  if (process.env.NODE_ENV === "development") {
    debug(`Visit http://localhost:${port} to develop your app`);
  }
};

// Initialize server after MongoDB connection
app.set("port", PORT); // Set the port for the Express app
debug(`Setting up server on port ${PORT}`); // Debug info for server setup

const server = app.listen(PORT, () => {
  console.log("server is running on port", PORT);
}); // Start the server on the defined port
server.on("error", onError); // Handle any errors
server.on("listening", () => {
  // Log when the server starts listening
  debug("Server started listening...");
  onListening(server);
});

// Connect to MongoDB with async/await
const connectDatabase = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true, // Use new parser for MongoDB connection
      useUnifiedTopology: true, // Use unified topology
    });
    debug(`Database connected to URI "${URI}"`);
    initiate(); // Start the server once the DB connection is successful
  } catch (error) {
    console.error(`There was an error connecting the database to URI "${URI}"`);
    debug(error); // Log error to debug
    process.exit(1); // Exit the process if database connection fails
  }
};

// Start database connection and server initiation
connectDatabase();
