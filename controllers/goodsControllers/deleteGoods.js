const fs = require('fs');
const path = require('path');
const { Goods, GoodsImage } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { goodsId } = req.body;

    const images = await GoodsImage.findAll({
      where: { goodId: goodsId },
      attributes: ['imagePath'],
    });
    for (let i = 0; i < images.length; i++) {
      if (images[i].imagePath && images[i].imagePath.includes('uploads')) {
        fs.unlink(path.join(__dirname, '../..', images[i].imagePath), (err) => {
          if (err) throw err;
        });
      }
    }
    await Goods.destroy({ where: { id: goodsId } });
    await GoodsImage.destroy({
      where: { goodId: goodsId },
      force: true,
    });

    res.status(200).json({ redirect_url: '/' });
  } catch (err) {
    next(err);
  }
};
