const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getBookings, 
    updateBookingStatus,
    updatePaymentStatus
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Protected route to book a slot
router.post('/', protect, createBooking);

// Protected routes for creators/admins to manage bookings
router.get('/', protect, getBookings);
router.put('/:id', protect, updateBookingStatus);
router.put('/:id/pay', protect, updatePaymentStatus);

module.exports = router;
