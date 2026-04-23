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
 * @desc    Verify Payment Signature and Update Booking (Critical Secure Module)
 * @route   POST /api/payment/verify-payment
 * @access  Private/Public
 */
exports.verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            bookingId 
        } = req.body;

        // 1. SECURITY CHECK: Verify inputs exist
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing critical payment identifiers"
            });
        }

        // 2. CRYPTOGRAPHIC VERIFICATION: HMAC SHA256
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        // 3. INTEGRITY CHECK
        if (razorpay_signature !== expectedSign) {
            console.error('[SECURITY ALERT] Invalid payment signature detected!');
            return res.status(400).json({
                success: false,
                message: "Payment verification failed: Invalid Signature"
            });
        }

        // 4. DATABASE UPDATE: Finalize Booking
        const Booking = require('../models/Booking');
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Payment verified, but booking record not found"
            });
        }

        // Update status and store IDs
        booking.status = 'confirmed';
        booking.paymentId = razorpay_payment_id;
        booking.orderId = razorpay_order_id;
        
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Payment verified and booking confirmed successfully",
            data: {
                bookingId: booking._id,
                status: booking.status
            }
        });

    } catch (error) {
        console.error('CRITICAL: Payment verification crash:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error during payment finalization"
        });
    }
};
