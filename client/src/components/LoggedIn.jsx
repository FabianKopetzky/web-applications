// LoggedIn.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function LoggedIn({ children }) {
  // const [isLoggedIn, setIsLoggedIn] = useState(null); // null = still checking

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     try {
  //       // Send cookie with request
  //       // const res = await fetch("/auth/check", {
  //       //   credentials: "include", // critical for sending cookies
  //       // });

  // const res = await fetch("/api/auth/check", {
  //   method: "POST",
  //   // headers: { "Content-Type": "application/json" },
  //   // body: JSON.stringify({ email }),
  //   credentials: "include"
  // });

  //       if (res.ok) {
  //         // If 200, user is logged in
  //         setIsLoggedIn(true);
  //       } else {
  //         // Any other status → not logged in
  //         setIsLoggedIn(false);
  //       }
  //     } catch (err) {
  //       console.error("Error checking login:", err);
  //       setIsLoggedIn(false);
  //     }
  //   };

  //   checkLogin();
  // }, []);

  // // While waiting for login check
  // if (isLoggedIn === null) return <p>Loading...</p>;

  // // If not logged in, redirect to login page
  // if (!isLoggedIn) return <Navigate to="/login" />;

  // // User is logged in → render protected content
  // return <>{children}</>;
  return null
}

export default LoggedIn;
