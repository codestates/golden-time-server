const express = require('express');
const commentsController = require('../controllers');
const passport = require('passport');

const router = express.Router();

router.delete(
  '/deleteComment',
  passport.authenticate('jwt', { session: false }),
  commentsController.comments.deleteComment
);

module.exports = router;
