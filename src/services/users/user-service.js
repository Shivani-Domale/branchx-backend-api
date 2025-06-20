
const bcrypt = require('bcryptjs');
const UserRepository = require('../../repositories/users/user-repository');
const { sendEmail } = require('../../utils/send-Email');

const userRepository = new UserRepository();

const getUserById = async (id) => {
  try {
    const user = await userRepository.findUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const findUserByEmail = async (email) => {
  return await userRepository.findUserByEmail(email);
};

const updateUserProfile = async (userId, role, updateData, roleFields) => {
  try {

    role = role?.toLowerCase(); // Normalize

    const allowedFields = roleFields[role];
    if (!allowedFields) throw new Error('Invalid role');

    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
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
    throw new Error(`Profile update failed: ${error.message}`);
  }
};

const sendOtpToEmail = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw new Error('User not found');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  await userRepository.updateUser(user.id, {
    resetOtp: otp,
    resetOtpExpires: expiry,
  });

  await sendEmail({
    to: user.email,
    subject: 'Password Reset OTP',
    html: `<p>Hello <strong>${user.fullName}</strong>,<br>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
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

module.exports = {
  getUserById,
  findUserByEmail,
  updateUserProfile,
  sendOtpToEmail,
  verifyOtpAndResetPassword,
};
