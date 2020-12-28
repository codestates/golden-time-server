const fs = require('fs');
const path = require('path');
const { Goods, GoodsImage } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { goodsId } = req.body;

    const images = GoodsImage.findAll({
      where: { goodId: goodsId },
      attributes: ['imagePath'],
    });
    for (let i = 0; i < images.length; i++) {
      if (image[i].imagePath && image[i].imagePath.includes('uploads')) {
        fs.unlink(path.join(__dirname, '../..', image[i].imagePath), (err) => {
          if (err) throw err;
        });
      }
    }

    await Goods.destroy({ where: { id: goodsId }, truncate: true });
    await GoodsImage.destroy({ where: { goodId: goodsId }, truncate: true });

    res.status(200).json({ redirect_url: '/' });
  } catch (err) {
    next(err);
  }
};
