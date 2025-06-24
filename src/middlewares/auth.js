const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secretkey';
const logger = require('../config/logger');

// Authenticate JWT Token Middleware
exports.authenticateToken = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(' ')[1];

    if (!token) {
      logger.warn(`Unauthorized access - No token provided - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
      return res.status(401).json({ message: 'Token required' });
    }

    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        logger.warn(`Unauthorized access - Invalid token - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
        return res.status(403).json({ message: 'Invalid token' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    logger.error(`Auth error - ${error.message} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Role-based Authorization Middleware
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      const userRole = req?.user?.role;

      if (!roles.includes(userRole)) {
        logger.warn(`Forbidden access - Role '${userRole}' not allowed - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
        return res.status(403).json({ message: 'Access denied: insufficient role' });
      }

      next();
    } catch (error) {
      logger.error(`Role check error - ${error.message} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};
