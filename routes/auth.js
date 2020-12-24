const express = require('express');
const authController = require('../controllers');

const router = express.Router();

router.post('/signup', authController.auth.signup);
router.post('/signout', authController.auth.signout);
router.post('/signin', authController.auth.signin);

module.exports = router;
