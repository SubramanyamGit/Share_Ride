import React from "react";
import { Navigate } from "react-router-dom";

function SecureRoute({ children }) {
  const token = localStorage.getItem("my_token");
  console.log("token",token)

  // Check if token exists; if not, redirect to SignIn
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Render children if token exists
  return children;
}

export default SecureRoute;
