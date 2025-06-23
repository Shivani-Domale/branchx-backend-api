const nodemailer = require('nodemailer');
const Logger = require('../config/logger');
require('dotenv').config();

module.exports = async (user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env?.ADMIN_EMAIL,
        pass: process.env?.ADMIN_PASSWORD,
      },
    });

    const message = {
      from: `"${user?.fullName}" <${process.env?.ADMIN_EMAIL}>`,
      to: process.env?.ADMIN_EMAIL,
      replyTo: user?.email,
      subject: 'New Contact Form Submission',
      text: `New message from ${user?.fullName}:

Phone: ${user?.phone}
Email: ${user?.email}
Location: ${user?.city}, ${user?.state}, ${user?.country}
Role: ${user?.role}
Business Name: ${user?.businessName}

Message:
${user?.message}`,
    };

    const info = await transporter.sendMail(message);
    Logger.info(`Email sent: ${info?.messageId}`);
  } catch (error) {
    Logger.error(`Failed to send email: ${error?.message}`);
    throw error;
  }
};


module.exports.sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or SMTP settings
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"BranchX Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};