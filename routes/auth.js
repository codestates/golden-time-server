const express = require('express');
const authController = require('../controllers');
const { upload } = require('./middleware');
const passport = require('passport');

const router = express.Router();
router.post('/signup', authController.auth.signUp);
router.post('/signin', authController.auth.signIn);
router.post('/google', authController.auth.google);
router.post('/kakao', authController.auth.kakao);
router.patch(
  '/modifieduser',
  passport.authenticate('jwt', { session: false }),
  upload.single('img'),
  authController.auth.modifiedUser,
);
router.post('/signout', authController.auth.signOut);
router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  authController.auth.userInfo,
);
router.post(
  '/modifiedpassword',
  passport.authenticate('jwt', { session: false }),
  authController.auth.modifiedPassword,
);

module.exports = router;
