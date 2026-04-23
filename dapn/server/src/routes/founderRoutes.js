const express = require('express');
const router = express.Router();
const { getFounders, addFounder } = require('../controllers/founderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getFounders)
    .post(protect, admin, addFounder);

module.exports = router;
