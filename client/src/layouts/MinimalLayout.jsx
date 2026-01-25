import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

// USAGE FOR: Login, Registration, Activation


const { Content } = Layout;

export default function MinimalLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
        <Navbar></Navbar>
      <Content
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}
