import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// ==============================
// 🛡️ Middleware: Verify Token
// ==============================
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  // 🚨 No token provided
  if (!token) {
    console.warn('❌ No token provided');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // ✅ Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('✅ Token Verified:', decoded);
    next();
  } catch (error) {
    console.error('❌ Invalid or expired token:', error.message);
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

// ==============================
// 🔒 Middleware: Verify Admin Access
// ==============================
export const verifyAdmin = (req, res, next) => {
  console.log('🔎 Checking Admin Access:', req.user);

  // 🚨 Check if user is authenticated
  if (!req.user) {
    console.error('❌ No user found in request');
    return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
  }

  // 🚨 Check if user is an admin
  if (req.user.isAdmin !== true) {
    console.error('❌ Access denied: User is not an admin');
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  console.log('✅ Admin Access Granted:', req.user);
  next();
};
