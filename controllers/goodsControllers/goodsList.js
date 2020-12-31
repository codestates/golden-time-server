const { User, Goods } = require('../../models');
const { Op } = require('sequelize');

module.exports = async (req, res, next) => {
  try {
    const { area } = req.body;
    const filterArea = await User.findAll({
      where: { area: area ? area : { [Op.not]: null } },
    });

    const filterUser = filterArea.map((user) => user.id);
    console.log(filterUser);
    const goods = await Goods.findAll({
      attributes: [
        'id',
        'title',
        'text',
        'price',
        'bidPrice',
        'categoryId',
        'createdAt',
      ],
      where: { [Op.or]: [{ userId: [...filterUser] }] },
      include: [
        {
          model: User,
          attributes: ['id', 'nick', 'profileImage'],
        },
      ],
    });
    res.status(200).json(goods);
  } catch (err) {
    next(err);
  }
};
