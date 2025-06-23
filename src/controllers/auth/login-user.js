const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../../services/users/user-service');

const SECRET = process.env.JWT_SECRET;

// Login Controller
const loginUser = async (req, res) => {
  try {
    const email = req?.body?.email;
    const role = req?.body?.role;
    const password = req?.body?.password;

    const user = await User.findOne({ where: { email, role } });

    if (!user) {
      return res.status(404).json({
        message: 'User not found with this email and role.',
        data: null,
        success: false,
        error: 'UserNotFound',
      });
    }

    if (user?.status !== 'ACTIVE') {
      return res.status(403).json({
        message: 'Your account has not been approved yet.',
        data: null,
        success: false,
        error: 'AccountNotApproved',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid Credentials.',
        data: null,
        success: false,
        error: 'InvalidPassword',
      });
    }

    const token = jwt.sign(
      { id: user?.id, email: user?.email, role: user?.role },
      SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user?.id,
        email: user?.email,
        role: user?.role,
        fullName: user?.fullName,
        status: user?.status,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({
      message: 'An error occurred while logging in.',
      data: null,
      success: false,
      error: 'InternalServerError',
    });
  }
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  try {
    const email = req?.body?.email;
    await userService.sendOtpToEmail(email);
    res.status(200).json({ message: 'OTP sent successfully', success: true });
  } catch (err) {
    res.status(404).json({ message: err?.message, success: false });
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = req?.body?.email;
    const otp = req?.body?.otp;
    const newPassword = req?.body?.newPassword;

    await userService.verifyOtpAndResetPassword(email, otp, newPassword);

    res.status(200).json({ message: 'Password reset successful', success: true });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(400).json({ message: err?.message, success: false });
  }
};

module.exports = {
  loginUser,
  forgotPassword,
  resetPassword,
};
