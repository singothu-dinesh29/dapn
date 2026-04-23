const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    authUser, 
    forgotPassword, 
    resetPassword, 
    mobileLogin, 
    verifyOtp 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

// Mobile Auth
router.post('/mobile-login', mobileLogin);
router.post('/verify-otp', verifyOtp);

// Google Auth (Simplified placeholders)
router.get('/google', (req, res) => res.send('Google Auth redirect...'));
router.get('/google/callback', (req, res) => res.send('Google Auth callback...'));

module.exports = router;
