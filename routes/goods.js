const express = require('express');
const goodsController = require('../controllers');
const passport = require('passport');

const router = express.Router();

router.post(
  '/addgoods',
  passport.authenticate('jwt', { session: false }),
  goodsController.goods.addGoods,
);
router.patch(
  '/modified',
  passport.authenticate('jwt', { session: false }),
  goodsController.goods.modifiedGoods,
);

module.exports = router;
