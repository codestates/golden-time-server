const { User, Goods } = require('../../models');

module.exports = async (req, res) => {
  try {
    const goods = await Goods.findAll({
      attributes: ['id', 'title', 'text', 'price', 'categoryId', 'createdAt'],
      include: [
        {
          model: User,
          attributes: ['id', 'nick', 'profileImage'],
        },
      ],
    });
    res.status(200).json(goods);
  } catch {}
};
