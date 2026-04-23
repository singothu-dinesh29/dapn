const express = require('express');
const router = express.Router();
const { 
    getBookings, 
    updateStatus, 
    updatePaymentStatus, 
    getUsers,
    deleteBooking,
    getAnalytics
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.use(protect);
router.use(admin);

router.get('/bookings', getBookings);
router.get('/analytics', getAnalytics);
router.put('/update-status/:id', updateStatus);
router.put('/payment-status/:id', updatePaymentStatus);
router.delete('/bookings/:id', deleteBooking);
router.get('/users', getUsers);

module.exports = router;
