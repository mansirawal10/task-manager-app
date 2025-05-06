// src/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Assuming token comes in Authorization header as Bearer token

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    console.log("Decoded Token:", decoded); // 🔹 Log to check values
    req.userId = decoded.userId;  // Store userId for future use

    next();
  });
};
