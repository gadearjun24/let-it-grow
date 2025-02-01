import axios from "axios";

// Create an instance of axios with baseURL and withCredentials enabled
const api = axios.create({
  baseURL: `https://sturdy-space-computing-machine-4j7qq7qjwgrqcq7jv-8080.app.github.dev/authentication`,
  withCredentials: true, // Ensures that cookies or tokens are sent with requests
});

// Signup API call
export const signUp = (body) =>
  api
    .post(
      "/sign-up",
      body, // Pass the body directly as the second argument to the post request
      {
        headers: {
          "Content-Type": "application/json", // Set content type for JSON request
          Authorization: "Bearer your-token", // Replace with your actual token if needed
        },
      }
    )
    .then((response) => response.data);

// SignIn API call
export const signIn = (body) =>
  api
    .post("/sign-in", body) // Just pass body as second argument
    .then((response) => response.data);

// Edit Profile API call
export const editProfile = (body) =>
  api
    .post("/edit", body) // Pass body as the second argument to the POST request
    .then((response) => response.data);

// SignOut API call
export const signOut = () =>
  api
    .post("/sign-out") // No need to pass any body here
    .then((response) => response.data);

// Load User API call (Me)
export const loadMe = () =>
  api
    .get("/me") // No body needed for a GET request
    .then((response) => response.data);
