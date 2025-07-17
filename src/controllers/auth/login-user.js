const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../../services/users/user-service');
const authService = require('../../services/users/user-service');
const { loginUserService } = require('../../services/users/user-service');
const SECRET = process.env.JWT_SECRET;

const loginUser = async (req, res) => {
  try {
    const { email, password } = req?.body || {};

    const { token, user } = await loginUserService(email, password);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user,
      success: true,
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(err.status || 500).json({
      message: err.message || 'Something went wrong.',
      success: false,
      error: err.name || 'InternalServerError',
      data: null,
    });
  }
};


//Forgot Password Controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    await userService.sendOtpToEmail(email);
    res.status(200).json({ success: true, message: 'OTP sent to email successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    await userService.verifyOtpAndResetPassword(email, otp, newPassword);
    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const resetPasswordWithOldPassword = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.user.id; // from JWT middleware
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'current and new password are required.' });
    }

    await userService.resetPassword(userId, currentPassword, newPassword);

    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'No token provided.',
        success: false,
        error: 'TokenMissing',
      });
    }

    await authService.logoutUser(token);

    return res.status(200).json({
      message: 'Logged out successfully.',
      success: true,
    });
  } catch (error) {
    console.error('Logout Error:', error.message);
    return res.status(500).json({
      message: 'An error occurred during logout.',
      success: false,
      error: 'LogoutFailed',
    });
  }
};
module.exports = {
  loginUser,
  forgotPassword,
  resetPasswordWithOldPassword,
  logoutUser,
  resetPasswordWithOtp
};
