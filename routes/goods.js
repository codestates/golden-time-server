const express = require('express');
const goodsController = require('../controllers');
const passport = require('passport');

const router = express.Router();

router.post(
  '/addgoods',
  passport.authenticate('jwt', { session: false }),
  goodsController.goods.addGoods,
);

module.exports = router;
