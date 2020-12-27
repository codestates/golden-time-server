const { Comment } = require('../../models');

module.exports = async (req, res) => {
  try {
    const { commentId } = req.body;
    const { id } = req.user;

    let commentInfo = await Comment.findOne({ where: { id: commentId } });

    if (id === commentInfo.userId) {
      let deleteComment = await Comment.destroy({ where: { id: commentId } });
      res.status(200).json({ message: 'deleted successfully' });
    } else {
      res.status(400).json({ message: 'not authorized' });
    };
  } catch (err) {
    res.status(400).json({ message: 'failed' });
  }
};
