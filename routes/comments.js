const express = require('express');
const commentsController = require('../controllers');
const passport = require('passport');

const router = express.Router();

router.delete(
  '/deleteComment',
  passport.authenticate('jwt', { session: false }),
  commentsController.comments.deleteComment
);
router.post(
  '/addcomment',
  passport.authenticate('jwt', { session: false }),
  commentsController.comments.addComment,
);
router.patch(
  '/modifiedcomment',
  passport.authenticate('jwt', { session: false }),
  commentsController.comments.modifiedComment,
);

module.exports = router;
