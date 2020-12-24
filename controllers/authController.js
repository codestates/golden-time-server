require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.signup = async (req, res) => {
  const { email, nick, password } = req.body;
  if (!email || !nick || !password) return res.status(400).send('error');
  const hash = await bcrypt.hash(password, 12);
  const exUser = await User.findOrCreate({
    where: { email },
    defaults: { nick, password: hash },
  });
  const [user, created] = exUser;
  if (created) {
    res.status(201).json({ redirect_url: '/' });
  } else {
    res.redirect('http://localhost:3000');
  }
};

exports.signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(400)
        .json({ message: info.message, redirect_url: '/login' });
    }
    return req.login(user, (err) => {
      if (err) return next(err);
      const token = jwt.sign(
        { id: user.id, nick: user.nick, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
      );
      res
        .status(200)
        .cookie('access_token', token)
        .json({ access_token: token, redirect_url: '/' });
    });
  })(req, res, next);
};

exports.signout = (req, res) => {
  // console.log(req.cookies)
  if (Object.keys(req.cookies).length === 0) {
    // console.log('에러')
    res.status(400).send({ message: 'not authorized' });
  } else {
    // console.log('로그아웃 완료')
    req.session.destroy(() => {
      req.session;
    });
    res.clearCookie();
    res.send({ message: 'successfully LOGOUT!' })
  }
};

exports.userInfo = (req, res) => {};

// exports.google = (req, res) => {};

// exports.kakao = (req, res) => {};

// exports.modify = (req, res) => {};
