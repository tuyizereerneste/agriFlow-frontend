import React from "react";
import { Navigate } from "react-router-dom";

// Function to decode JWT token and get its payload
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  const decodedToken = parseJwt(token);

  if (!decodedToken || !decodedToken.exp) {
    console.warn("Invalid or missing token expiration, redirecting to login.");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  const currentTime = Math.floor(Date.now() / 1000);

  if (decodedToken.exp < currentTime) {
    console.warn("Token expired, clearing token and redirecting.");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;