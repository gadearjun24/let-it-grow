import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ authorized, redirect, element }) => {
  if (authorized) {
    // If authorized, render the passed element (Homeview in this case)
    return element;
  } else {
    // If not authorized, redirect to the specified route
    return <Navigate to={redirect} />;
  }
};

export default ProtectedRoute;
