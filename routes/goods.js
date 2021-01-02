const express = require('express');
const goodsController = require('../controllers');
const { upload } = require('./middleware');
const passport = require('passport');

const router = express.Router();

router.post(
  '/addgoods',
  passport.authenticate('jwt', { session: false }),
  upload.array('img'),
  goodsController.goods.addGoods,
);
router.patch(
  '/modified',
  passport.authenticate('jwt', { session: false }),
  upload.any('img'),
  goodsController.goods.modifiedGoods,
);
router.get('/detail/:id', goodsController.goods.goodsDetail);
router.post('/', goodsController.goods.goodsList);
router.post(
  '/delete',
  passport.authenticate('jwt', { session: false }),
  goodsController.goods.deleteGoods,
);
router.patch(
  '/bid',
  passport.authenticate('jwt', { session: false }),
  goodsController.goods.goodsBid,
);
router.get(
  '/mygoods',
  passport.authenticate('jwt', { session: false }),
  goodsController.goods.myGooods,
);

module.exports = router;
