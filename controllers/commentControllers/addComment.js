const { Comment } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { goodsId, commentMessage } = req.body;
    const { id, nick, profileImage } = req.user;


    let comment = await Comment.create({
      userId: id,
      commentMessage,
      goodId: goodsId,
    });

    res.status(200)
    .json({ 
      commentId: comment.id,
      commentMessage: comment.commentMessage,
      goodsId: comment.goodId,
      createdAt: comment.createdAt,
      user: {
        id,
        nick,
        profileImage,
      }
    });
  } catch (err) {
    next(err);
  }
};
