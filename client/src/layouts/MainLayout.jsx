import { Layout } from "antd";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const { Content, Footer } = Layout;

export default function MainLayout({ isLoggedIn = false, maxWidth = 1200, contentPadding = "24px" }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar isLoggedIn={isLoggedIn} />

      <Content
        style={{
          padding: contentPadding,
          maxWidth: maxWidth,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Outlet />
      </Content>

      <Footer style={{ textAlign: "center" }}>
        © 2026 YourApp
      </Footer>
    </Layout>
  );
}
