require('dotenv').config();
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const axios = require('axios');


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

exports.userInfo = (req, res) => {
  console.log('작동확인',req.user.dataValues);

  let { id, email, nick, profileImage, provider, createdAt } = req.user.dataValues;
  console.log(req.user.dataValues);

  res.status(200).json({
    id, 
    email,
    nick,
    profile: profileImage,
    provider,
    createdAt,
  });
};

// exports.google = (req, res) => {};

exports.kakao = async (req, res) => {
  const { authorizationCode } = req.body;
  let redirectUrl = 'http://localhost:3000'

  let kakaoTokenRequest = await axios.post(
    `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${redirectUrl}&code=${authorizationCode}`
  );

  let kakaoAccessToken = kakaoTokenRequest.access_token;
  // let kakaoRefreshToken = kakaoTokenRequest.refresh_token;

  let kakaoUserInfo = await axios.get(
    "https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`
      }
    }
  );

  let kakao = kakaoUserInfo.kakao_account;
  let userRegister = await User.findOrCreate({
    // db : email, nick, profileImage
    where: { email: kakao.email },
    defaults: {
      email: kakao.email,
      nick: kakao.profile.nickname,
      profileImage: kakao.profile.profile_image_url,
    }
  })

  let [ user ] = userRegister;
  let { id, email, nick } = user.dataValues;

  let localToken = await jwt.sign({
    id: id,
    email: email,
    nick: nick,
  }, process.env.JWT_SECRET, { expiresIn: '7d' })

  res.status(200)
  .cookie('access_token', localToken)
  .json({ access_token: localToken, redirect_url: '/' })
};

// exports.modify = (req, res) => {};
