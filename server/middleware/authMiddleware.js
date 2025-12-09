// // middleware/auth.js
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const requireAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.token; // assuming your cookie is named 'token'
//     if (!token) return res.status(401).json({ message: 'Unauthorized' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password'); // exclude password
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     req.user = user; // attach user to request
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };
