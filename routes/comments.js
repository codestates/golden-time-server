const express = require('express');
const commentsController = require('../controllers');
const passport = require('passport');

const router = express.Router();

router.post(
  '/addcomment',     
  passport.authenticate('jwt', { session: false }),
  commentsController.comment.addComment,
);

module.exports = router;
