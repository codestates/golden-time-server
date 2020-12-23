const express = require('express');
const authController = require('../controllers');

const router = express.Router();

router.post('/signup', authController.auth.signup);

module.exports = router;
