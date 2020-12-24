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

exports.userInfo = async (req, res) => {};

exports.google = (req, res) => {};

exports.kakao = async (req, res) => {
  console.log('코드확인', req.body.authorizationCode);
  const { authorizationCode } = req.body;

  let kakaoTokenRequest = await axios.post(
    `https://kauth.kakao.com/oauth/token?code=${authorizationCode}&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=http://localhost:3000&grant_type=authorization_code`
  );

  let kakaoAccessToken = kakaoTokenRequest.data.access_token;

  let kakaoUserInfo = await axios.get(
    "https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`
      }
    }
  );
  
  let kakao = kakaoUserInfo.data;

  let Email = kakao.kakao_account.email;
  let Nick = kakao.properties.nickname;
  let profileImage = kakao.properties.profile_image;

  let userRegister = await User.findOrCreate({
    where: { email: Email },
    defaults: {
      email: Email,
      nick: Nick,
      profileImage: profileImage,
      provide: 'kakao',
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

exports.modify = (req, res) => {};
