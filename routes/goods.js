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
  goodsController.goods.modifiedGoods,
);
router.get('/', goodsController.goods.goodsList);

module.exports = router;
