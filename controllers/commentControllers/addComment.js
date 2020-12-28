const { Comment } = require('../../models');

module.exports = async (req, res) => {
  const { goodsId, commentMessage } = req.body;
  const { id } = req.user;

  let comment = await Comment.create({
    userId: id,
    commentMessage,
    goodsId,
  });

  res.status(200)
  .json({ 
    message: "completed",
    commentInfo: {
      commentId: comment.id,
      userId: comment.userId,
      commentMessage: comment.commentMessage,
      goodsId: comment.goodsId,
    }
  });
};
