const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    KEY_ID: process.env?.RAZORPAY_KEY_ID,
    KEY_SECRET: process.env?.RAZORPAY_KEY_SECRET,
}