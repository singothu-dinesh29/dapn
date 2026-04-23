const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    getRevenueStats, 
    getUsers 
} = require('../controllers/adminDashboardController');
const { verifyAdminToken } = require('../middleware/verifyAdminToken');

// Apply Security Middleware to all routes in this router
router.use(verifyAdminToken);

// @route   GET /api/admin/dashboard
router.get('/dashboard', getDashboardStats);

// @route   GET /api/admin/revenue
router.get('/revenue', getRevenueStats);

// @route   GET /api/admin/users
router.get('/users', getUsers);

module.exports = router;
