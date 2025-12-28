import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Optional: call backend logout API if needed

    // Redirect to login
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
}
