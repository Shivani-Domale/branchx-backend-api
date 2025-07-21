const Razorpay = require('razorpay');
const { PaymentConfig } = require('../../config');

const razorpay = new Razorpay({
    key_id: PaymentConfig?.KEY_ID,
    key_secret: PaymentConfig?.KEY_SECRET
});

module.exports = razorpay;