const { verifyToken } = require('../utils/auth');
const User = require('../models/User');
const db = require('../config/db');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    User.findById(decoded.id, db, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid token. User not found.' });
      }

      // Attach user to request
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.', error: error.message });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

const authorizeManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Access denied. Managers only.' });
  }
  next();
};

const authorizeStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Students only.' });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeManager,
  authorizeStudent
};