const { Goods, User } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.user;
    const goodsInfo = await Goods.findAll({
      where: { userId: id },
      attributes: [
        'id',
        'title',
        'thumbnail',
        'price',
        'bidPrice',
        'closing_time',
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'nick', 'profileImage'],
        },
      ],
    });
    res.status(200).json(goodsInfo);
  } catch (err) {
    next(err);
  }
};
