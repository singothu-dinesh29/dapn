const express = require('express');
const router = express.Router();
const { loginWithKey } = require('../controllers/adminAuthController');

// @route   POST /api/admin/login
router.post('/login', loginWithKey);

module.exports = router;
