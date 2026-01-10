import { Layout, Button, Dropdown, Space } from "antd";
import { Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";

const { Header } = Layout;

export default function Navbar({ isLoggedIn }) {
  const { t, i18n } = useTranslation();

  const languageMenu = {
    items: [
      { key: "en", label: "English", onClick: () => i18n.changeLanguage("en") },
      { key: "de", label: "Deutsch", onClick: () => i18n.changeLanguage("de") },
    ],
  };

  return (
    <Header
      style={{
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo / Title */}
      <Link
        to="/"
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#1677ff",
        }}
      >
        <Logo />
        {/* {t("landing.appTitle")} */}
      </Link>

      {/* Right side actions */}
      <Space size="middle">


        {!isLoggedIn && (
          <>
            <Link to="/login">
              <Button type="text">
                {t("login.title")}
              </Button>
            </Link>

            <Link to="/register">
              <Button type="primary">
                {t("register.title")}
              </Button>
            </Link>
          </>
        )}

                <Dropdown menu={languageMenu}>
          <Button type="text">
            {i18n.language.toUpperCase()} <DownOutlined />
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
}
