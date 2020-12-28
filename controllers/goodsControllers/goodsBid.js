const { Goods } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { bidPrice, goodsId } = req.body;

    let updateBidder = await Goods.update(
      { 
        bidPrice,
        bidder: req.user.id
      },
      { where: { id: goodsId } },
    );

    res.status(200).json({ bidder: req.user.nick, bidPrice: bidPrice });
  } catch (err) {
    next(err);
  }
}
