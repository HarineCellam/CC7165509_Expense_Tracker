const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

// GET /api/profile/:email - Retrieve user profile by email
router.get('/:email', authMiddleware, profileController.getProfile);

module.exports = router;