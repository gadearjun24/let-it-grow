import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client'
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Create a root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app inside the root element
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
