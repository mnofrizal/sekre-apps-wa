const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/status', authController.getAuthStatus);
router.post('/logout', authController.logout);

module.exports = router;