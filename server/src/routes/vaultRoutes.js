const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

/**
 * @desc    Get all bookings (Hidden Admin Endpoint)
 * @route   GET /api/v1/vault-core/bookings
 * @access  Private/Admin
 */
router.get('/bookings', protect, admin, async (req, res) => {
    try {
        const bookings = await Booking.find({}).sort('-createdAt');
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Access Denied',
            error: error.message
        });
    }
});

/**
 * @desc    Get Admin Analytics (Hidden)
 * @route   GET /api/v1/vault-core/stats
 */
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
        
        res.status(200).json({
            success: true,
            data: {
                totalBookings,
                confirmedBookings,
                pendingBookings: totalBookings - confirmedBookings
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
