import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/authentication`,
  withCredentials: true,
});

export const signUp = (body) =>
  api
    .post(
      "https://sturdy-space-computing-machine-4j7qq7qjwgrqcq7jv-8080.app.github.dev/sign-up",
      body
    )
    .then((response) => response.data);

export const signIn = (body) =>
  api
    .post(
      "https://sturdy-space-computing-machine-4j7qq7qjwgrqcq7jv-8080.app.github.dev/sign-in",
      body
    )
    .then((response) => response.data);

export const editProfile = (body) =>
  api.post("/edit", body).then((response) => response.data);

export const signOut = () =>
  api.post("/sign-out").then((response) => response.data);

export const loadMe = () => api.get("/me").then((response) => response.data);
