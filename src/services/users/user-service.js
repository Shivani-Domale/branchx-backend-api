const bcrypt = require('bcryptjs');
const UserRepository = require('../../repositories/users/user-repository');
const { sendEmail } = require('../../utils/send-Email');
const jwt = require('jsonwebtoken');
const userRepository = new UserRepository();
const SECRET = process.env.JWT_SECRET;


const loginUserService = async (email, password) => {
  try {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      const error = new Error('User not found with this email.');
      error.status = 404;
      error.name = 'UserNotFound';
      throw error;
    }

    if (user?.status !== 'ACTIVE') {
      const error = new Error('Your account has not been approved yet.');
      error.status = 403;
      error.name = 'AccountNotApproved';
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials.');
      error.status = 401;
      error.name = 'InvalidPassword';
      throw error;
    }

    const token = jwt.sign(
      {
        id: user?.id,
        fullName: user?.fullName,
        email: user?.email,
        role: user?.role,
      },
      SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user?.id,
        email: user?.email,
        role: user?.role,
        fullName: user?.fullName,
        status: user?.status,
      },
    };
  } catch (err) {
    console.error('Error in loginUserService:', err.message);
    throw err;
  }
};


const getUserById = async (id) => {
  try {
    const user = await userRepository.findUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error?.message}`);
  }
};


const updateUserProfile = async (userId, role, updateData, roleFields) => {
  try {
    role = role?.toLowerCase(); // Normalize role safely

    const allowedFields = roleFields?.[role];
    if (!allowedFields) throw new Error('Invalid role');

    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData?.[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    await userRepository.updateUser(userId, filteredData);
    const updatedUser = await userRepository.findUserById(userId);

    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  } catch (error) {
    throw new Error(`Profile update failed: ${error?.message}`);
  }
};


const sendOtpToEmail = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw new Error('User not found');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await userRepository.updateUser(user.id, {
    resetOtp: otp,
    resetOtpExpires: expiry,
  });

  await sendEmail({
    to: email,
    subject: 'Password Reset OTP',
    html: `<p>Hello <strong>${user.fullName}</strong>,<br>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
  });

  return true;
};

const verifyOtpAndResetPassword = async (email, otp, newPassword) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw new Error('User not found');

  const isValidOtp =
    user.resetOtp === otp &&
    user.resetOtpExpires &&
    new Date(user.resetOtpExpires) > new Date();

  if (!isValidOtp) throw new Error('Invalid or expired OTP');

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.updateUser(user.id, {
    password: hashedPassword,
    resetOtp: null,
    resetOtpExpires: null,
  });

  return true;
};

const resetPassword = async (userId, currentPassword, newPassword) => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error('Current password is incorrect');

  //  Check if new password is same as old one
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new Error('New password must be different from the current password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.updateUser(userId, { password: hashedPassword });

  return true;
};


const logoutUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // or use const SECRET
    const expiresAt = new Date(decoded.exp * 1000); // JWT exp to JS date
    await userRepository.blacklistToken(token, expiresAt);
    return { success: true };
  } catch (error) {
    console.error('Error in logoutUser Service:', error.message);
    throw new Error('InvalidToken');
  }
};

const checkIfTokenBlacklisted = async (token) => {
  try {
    return await userRepository.isTokenBlacklisted(token);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  loginUserService,
  getUserById,
  updateUserProfile,
  sendOtpToEmail,
  verifyOtpAndResetPassword,
  resetPassword,
  logoutUser,
  checkIfTokenBlacklisted,
};
