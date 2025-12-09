// const express = require('express');

// module.exports = (app) => {
//   const router = express.Router();
//   const authMiddleware = require('../middleware/authMiddleware')(app);

// // session.js or auth route
// router.get('/check', authMiddleware, (req, res) => {
//   if (!req.user) return res.status(401).json({ loggedIn: false });

//   const { firstName, lastName, email } = req.user;

//   res.json({
//     loggedIn: true,
//     user: {
//       firstName,
//       lastName,
//       email,
//     },
//   });
// });


//   return router;
// };
