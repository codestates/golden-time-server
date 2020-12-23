const { User } = require('../models');
const bcryto = require('bcrypt');
const jwt =  require('jsonwebtoken');
const axios = require('axios');

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

exports.userInfo = async (req, res) => {
  const authorization = req.headers["Authencation"];
  if (!authorization) {
    res.status(400).json({ messages: "로그인이 필요합니다" });
  } else {
    let token = authorization.split(' ')[1];

    let userData = await jwt.verify(token, process.env.JWT_SECRET)
    if (userData) {
      res.status(200).send({  })
    }
  }
};

exports.google = (req, res) => {};

exports.kakao = async (req, res) => {
  let code = req.headers["Authentication"];
  let redirectUrl = 'http://localhost:3000'

  let kakaoTokenRequest = await axios.post(
    `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${redirectUrl}&code=${code}`
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

  let user = await User.create({
    // db : email, nick, profileImage
    email: kakaoUserInfo.kakao_account.email,
    nick: kakaoUserInfo.kakao_account.profile.nickname,
    profileImage: kakaoUserInfo.kakao_account.profile.profile_image_url,
  })

  res.status(200).send({ 
    access_token: kakaoAccessToken,
    redirect_url: '/',
  })
};

exports.modify = (req, res) => {};
