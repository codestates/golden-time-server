const { User } = require('../models');
const bcryto = require('bcrypt');

exports.signup = async (req, res) => {
  const { email, nick, password } = req.body;
  if (!email || !nick || !password) return res.status(400).send('error');
  const hash = await bcryto.hash(password, 12);
  const exUser = await User.findOrCreate({
    where: { email },
    defaults: { email, nick, password: hash },
  });
  const [user, created] = exUser;
  if (created) {
    res.status(201).json({ redirect_url: '/' });
  } else {
    res.redirect('http://localhost:3000');
  }
};

exports.signin = (req, res) => {};

exports.signout = (req, res) => {};

exports.userInfo = (req, res) => {};

exports.google = (req, res) => {};

exports.kakao = (req, res) => {};

exports.modify = (req, res) => {};
