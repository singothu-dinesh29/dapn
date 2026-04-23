const Razorpay = require('razorpay');
const dotenv = require('dotenv');

dotenv.config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_default',
    key_secret: process.env.RAZORPAY_SECRET || 'secret_default',
});

module.exports = razorpayInstance;
