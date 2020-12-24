const express = require('express');
const authController = require('../controllers');
const passport = require('passport');

const router = express.Router();

router.post('/signup', authController.auth.signup);
router.post('/signin', authController.auth.signin);
router.post('/google', authController.auth.google);
router.patch(
  '/modifieduser',
  passport.authenticate('jwt', { session: false }),
  authController.auth.modify,
);

module.exports = router;
