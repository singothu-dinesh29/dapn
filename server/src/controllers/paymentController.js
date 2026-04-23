const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');

/**
 * @desc    Create a new Razorpay Order
 * @route   POST /api/payment/create-order
 * @access  Public
 */
exports.createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: 'Amount is required'
            });
        }

        // Razorpay expects amount in the smallest currency unit (e.g., paise for INR)
        const options = {
            amount: Number(amount) * 100, 
            currency,
            receipt,
        };

        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create Razorpay order'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order created successfully',
            order
        });

    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment Gateway Error',
            error: error.message
        });
    }
};

/**
 * @desc    Verify Payment Signature (Security Best Practice)
 */
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid signature, payment verification failed"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error during verification"
        });
    }
};
