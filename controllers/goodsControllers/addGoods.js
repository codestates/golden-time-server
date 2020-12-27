const { Goods, GoodsImage } = require('../../models');

module.exports = async (req, res) => {
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
        goodsId: goods.id,
        imagePath: req.files[i].path,
      });
    }
    res.status(200).json({ redirect_url: `/goods/${goods.id}` });
  } catch (err) {
    res.stauts(400).json({ message: '상품등록에 실패하였습니다.' });
  }
};
