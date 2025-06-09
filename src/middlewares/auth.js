const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secretkey';
const logger = require('../config/logger');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // contains id and role
    next();
  });
};

exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient role' });
  }
  next();
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

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
};

exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    logger.warn(`Forbidden access - Role '${req.user.role}' not allowed - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    return res.status(403).json({ message: 'Access denied: insufficient role' });
  }
  next();
};