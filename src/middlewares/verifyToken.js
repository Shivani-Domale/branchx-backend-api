const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    console.log(req);
    
    const authHeader = req.headers?.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Malformed token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token expired' });
    }

    console.log('JWT Verification Error:', err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;
