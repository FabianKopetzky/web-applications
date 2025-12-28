const express = require("express");
const router = express.Router();
// const fetch = require("node-fetch"); // if needed, or use axios

// router.post("/check", async (req, res) => {
//   console.log("This is the /api/auth/check route");
//    const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json({ message: "Not logged in" });
//   else return res.status(200).json({message: "Token exists"})
// });


// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Call your OAuth2 token endpoint
//     const tokenRes = await fetch("http://localhost:3000/api/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: new URLSearchParams({
//         username,
//         password,
//         grant_type: "password",
//         client_id: "client",
//       }),
//     });

//     const tokenData = await tokenRes.json();

//     // Set HTTP-only cookie
//     res.cookie("accessToken", tokenData.accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60 * 1000, // 1 hour
//       // sameSite: "Strict",
//       sameSite: "lax"
//     });

//     res.json({ message: "Logged in successfully" });
//   } catch (err) {
//     res.status(401).json({ message: "Login failed" });
//   }
// });

// router.post("/logout", (req, res) => {
//   // Clear the accessToken cookie
//   res.clearCookie("accessToken", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax", // must match the cookie settings from login
//   });

//   res.json({ message: "Logged out successfully" });
// });


module.exports = router;
