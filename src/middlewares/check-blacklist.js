const authService = require('../services/users/user-service');

const checkBlacklistedToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    const isBlacklisted = await authService.checkIfTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({
        message: 'Token has been revoked. Please login again.',
        success: false,
        error: 'TokenBlacklisted',
      });
    }

    next();
  } catch (error) {
    console.error('Token Blacklist Check Error:', error.message);
    return res.status(500).json({
      message: 'Internal server error during token check.',
      success: false,
      error: 'InternalServerError',
    });
  }
};

module.exports = checkBlacklistedToken;
