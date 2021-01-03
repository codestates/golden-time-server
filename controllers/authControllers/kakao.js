require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { authorizationCode, area } = req.body;

    const kakaoTokenRequest = await axios.post(
      `https://kauth.kakao.com/oauth/token?code=${authorizationCode}&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=https://d8vvnifrux96q.cloudfront.net&grant_type=authorization_code`,
    );
    const kakaoAccessToken = kakaoTokenRequest.data.access_token;
    const kakaoUserInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });

    const kakao = kakaoUserInfo.data;
    const snsId = kakao.id;
    const email = kakao.kakao_account.email;
    const nick = kakao.properties.nickname;
    const profileImage = kakao.properties.thumbnail_image;

    const userRegister = await User.findOrCreate({
      where: { email },
      defaults: {
        snsId,
        email,
        nick,
        profileImage,
        area,
        provider: 'kakao',
      },
    });
    const [user, created] = userRegister;
    const localToken = await jwt.sign(
      {
        id: user.id,
        email: user.email,
        nick: user.nick,
        provider: user.provider,
        area: user.area,
        profileImage: user.profileImage,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    res
      .status(200)
      .cookie('access_token', localToken)
      .json({ access_token: localToken, redirect_url: '/' });
  } catch (err) {
    next(err);
  }
};
