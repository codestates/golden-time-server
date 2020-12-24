const { Goods, GoodsImage } = require('../models');

exports.addGoods = async (req, res) => {
  const {
    userId,
    title,
    text,
    price,
    categoryId,
    bidder,
    bidPrice,
    closing_time,
    images,
  } = req.body;
  const goods = await Goods.create({
    userId,
    title,
    text,
    price,
    categoryId,
    bidder,
    bidPrice,
    thumbnail: images[0],
    closing_time,
  });
  let image;
  for (let i = 0; i < images.length; i++) {
    image = await GoodsImage.create({
      goodsId: goods.id,
      imagePath: images[i],
    });
  }
  console.log(goods);
};
