const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../../config');

const SECRET = process.env.JWT_SECRET;


exports.loginUser = async (req, res) => {
  const { email, role, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, role } });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email and role.' });
    }
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ message: 'Your account has not been approved yet.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '7d' }
    );
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong while logging in.' });
  }
};