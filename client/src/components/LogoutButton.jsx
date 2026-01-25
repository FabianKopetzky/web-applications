import React from "react";
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
      <Button variant="dashed" danger onClick={handleLogout}>
      {t("login.logout")}
    </Button>
  );
}
