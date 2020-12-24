require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../../models');

module.exports = async (req, res) => {
  const { authorizationCode } = req.body;

  let kakaoTokenRequest = await axios.post(
    `https://kauth.kakao.com/oauth/token?code=${authorizationCode}&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=http://localhost:3000&grant_type=authorization_code`,
  );
  let kakaoAccessToken = kakaoTokenRequest.data.access_token;
  let kakaoUserInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${kakaoAccessToken}`,
    },
  });

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
    },
  });
  let [user] = userRegister;
  let { id, email, nick } = user.dataValues;
  let localToken = await jwt.sign(
    {
      id: id,
      email: email,
      nick: nick,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );

  res
    .status(200)
    .cookie('access_token', localToken)
    .json({ access_token: localToken, redirect_url: '/' });
};
