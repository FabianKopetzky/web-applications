import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

export default function LoggedIn({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get("/getUser", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
        setAuthorized(true);
      } catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>; // or spinner

  if (!authorized) return <Navigate to="/login" replace />;

  return children;
}
