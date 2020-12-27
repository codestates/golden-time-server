const { User, Goods, GoodsImage, Comment } = require('../../models');
const user = require('../../models/user');

module.exports = async (req, res) => {
  const findGoods = await Goods.findAll({
    include: [
      {
        model: GoodsImage,
        required: false,
        attributes: ['imagePath'],
        where: {
          goodsId: req.params.id,
        },
      },
      {
        model: Comment,
        required: false,
        attributes: ['id', 'userId', 'commentMessage', 'createdAt'],
        where: {
          goodsId: req.params.id,
        }
      },
    ],
    where: {
      id: req.params.id,
    },
  })

  const [ goodsDetail ] = findGoods;
  const { id, userId, title, text, bidder, price, bidPrice, closing_time, images, comments } = goodsDetail;

  const userInfo = await User.findOne( {
    where: { id: userId }
  });

  const commentUserInfo = [];
  for (let i = 0; i < comments.length; i += 1) {
    let oneComment = {};

    let findUser = await User.findOne({
      where: comments[i].userId,
    });

    oneComment.commentId = comments[i].id;
    oneComment.userId = comments[i].userId;
    oneComment.nick = findUser.nick;
    oneComment.commentMessage = comments[i].commentMessage;
    oneComment.createdAt = comments[i].createdAt;

    commentUserInfo.push(oneComment);
  };

  res.status(200)
  .json({
    id,
    title,
    text,
    bidder,
    price,
    bidPrice,
    closing_time,
    images,
    comments: commentUserInfo,
    user: {
      userId: userInfo.id,
      nick: userInfo.nick,
      profile_image: userInfo.profileImage,
    },
  });
};
