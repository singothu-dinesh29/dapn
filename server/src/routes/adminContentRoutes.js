const express = require('express');
const router = express.Router();
const { addContent, getAllContent } = require('../controllers/adminContentController');
const { verifyAdminToken } = require('../middleware/verifyAdminToken');

// All CMS routes require Admin Verification
router.use(verifyAdminToken);

// @route   POST /api/admin/content/add
router.post('/add', addContent);

// @route   GET /api/admin/content/all
router.get('/all', getAllContent);

module.exports = router;
