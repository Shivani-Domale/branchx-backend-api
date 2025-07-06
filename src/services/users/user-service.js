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
    throw new Error(`Error fetching user: ${error?.message}`);
  }
};

const findUserByEmail = async (email) => {
  return await userRepository.findUserByEmail(email);
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
  try {
    const user = await userRepository.findUserByEmail(email);
    if (!user) throw new Error('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await userRepository.updateUser(user?.id, {
      resetOtp: otp,
      resetOtpExpires: expiry,
    });

    await sendEmail({
      to: user?.email,
      subject: 'Password Reset OTP',
      html: `<p>Hello <strong>${user?.fullName}</strong>,<br>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    return true;
  } catch (error) {
    console.error('Error in sendOtpToEmail:', error?.message);
    throw new Error(`Failed to send OTP: ${error?.message}`);
  }
};

const resetPassword = async (userId, currentPassword, newPassword) => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw new Error('User not found');

  const isCurrentCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentCorrect) {
    throw new Error('Incorrect current password');
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new Error('New password must be different from the current password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.updateUser(userId, { password: hashedPassword });

  return true;
};

module.exports = {
  getUserById,
  findUserByEmail,
  updateUserProfile,
  sendOtpToEmail,
  resetPassword,
};
