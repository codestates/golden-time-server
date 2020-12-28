const fs = require('fs');
const path = require('path');
const { GoodsImage, Goods } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { goodsId, title, text } = req.body;
    const id = Number(goodsId);
    const imageFiles = req.files;
    const findImages = await GoodsImage.findAll({
      where: { goodId: id },
      attributes: ['imagePath'],
    });
    for (let i = 0; i < findImages.length; i++) {
      if (
        findImages[i].imagePath &&
        findImages[i].imagePath.includes('uploads')
      ) {
        fs.unlink(
          path.join(__dirname, '../..', findImages[i].imagePath),
          (err) => {
            if (err) throw err;
          },
        );
      }
    }
    const imageArray = imageFiles.reduce((acc, img) => {
      const obj = {};
      obj.goodId = id;
      obj.imagePath = img.path;
      acc.push(obj);
      return acc;
    }, []);
    await Goods.update({ title, text }, { where: { id } });
    await GoodsImage.destroy({ where: { goodId: id }, truncate: true });
    await GoodsImage.bulkCreate(imageArray);
    const updateGoods = await Goods.findOne({ where: { id } });
    res.status(200).json({ redirct_url: `/detail/${updateGoods.id}` });
  } catch (err) {
    next(err);
  }
};
