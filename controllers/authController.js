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
    res.status(400).json({ message: '이미 가입된 회원입니다.' });
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
        {
          id: user.id,
          nick: user.nick,
          email: user.email,
          provider: updateInfo.provider,
          profileImage: user.profileImage,
        },
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

exports.google = async (req, res) => {
  try {
    const { authorizationCode } = req.body;
    const googleToken = await axios.post(
      `https://oauth2.googleapis.com/token?client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_SECRET_KEY}&code=${authorizationCode}&grant_type=authorization_code&redirect_uri=http://localhost:3000`,
    );
    const { access_token } = googleToken.data;
    const googleData = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`,
    );
    const exUser = await User.findOrCreate({
      where: { email: googleData.data.email },
      defaults: {
        nick: googleData.data.name,
        snsId: googleData.data.id,
        profileImage: googleData.data.picture,
        provider: 'google',
      },
    });
    const [user, created] = exUser;
    const token = jwt.sign(
      {
        id: user.id,
        nick: user.nick,
        email: user.email,
        provider: updateInfo.provider,
        profileImage: user.profileImage,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
    res.status(200).json({ access_token: token });
  } catch (err) {
    res.status(400).json({ message: '' });
  }
};

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


exports.modify = async (req, res) => {
  const { nick, image } = req.body;
  const updateInfo = await User.update(
    { nick, profileImage: image },
    { where: { id: req.user.id } },
  );
  const token = jwt.sign(
    {
      id: updateInfo.id,
      nick: updateInfo.nick,
      emai: updateInfo.email,
      provider: updateInfo.provider,
      profileImage: updateInfo.profileImage,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
  res.status(200).json({ token });
};

