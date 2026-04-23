const express = require('express');
const router = express.Router();
const { createBooking, getBookings } = require('../controllers/bookingController');

// @route   POST /api/booking/create-booking
router.post('/create-booking', createBooking);

// @route   GET /api/booking/list (For internal/admin use)
router.get('/list', getBookings);

module.exports = router;
