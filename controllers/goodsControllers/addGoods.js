const { Goods, GoodsImage } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { title, text, price, categoryId, closing_time } = req.body;
    const goods = await Goods.create({
      userId: id,
      title,
      text,
      price,
      categoryId,
      thumbnail: req.files[0].path,
      closing_time,
    });

    for (let i = 0; i < req.files.length; i++) {
      await GoodsImage.create({
        goodId: goods.id,
        imagePath: req.files[i].path,
      });
    }
    res.status(200).json({ redirect_url: `/goods/detail/${goods.id}` });
  } catch (err) {
    next(err);
  }
};
