const { Comment } = require('../../models');

module.exports = async (req, res) => {
  const { goodsId, commentMessage } = req.body;
  const { id, nick, profileImage } = req.user;

  let comment = await Comment.create({
    userId: id,
    commentMessage,
    goodsId,
  });

  res.status(200)
  .json({ 
    commentId: comment.id,
    commentMessage: comment.commentMessage,
    createdAt: comment.createdAt,
    user: {
      id,
      nick,
      profileImage,
    }
  });
};
