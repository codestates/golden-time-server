const express = require('express');
const authController = require('../controllers');
const passport = require('passport');

const router = express.Router();

router.post('/signup', authController.auth.signup);
router.post('/signout', authController.auth.signout);
router.post('/signin', authController.auth.signin);
router.get('/user', passport.authenticate('jwt', { session: false }), authController.auth.userInfo);

module.exports = router;
