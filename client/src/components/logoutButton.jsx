import React from "react";
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Optional: call backend logout API if needed

    // Redirect to login
    navigate("/login");
  };

  return (
      <Button type="primary" danger onClick={handleLogout}> 
      {t("login.logout")}
    </Button>
  );
}
