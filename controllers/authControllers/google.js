require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const axios = require('axios');

module.exports = async (req, res, next) => {
  try {
    const { authorizationCode, area } = req.body;
    const googleToken = await axios.post(
      `https://oauth2.googleapis.com/token?client_id=${process.env.GOOGLE_CLIENT}&client_secret=${process.env.GOOGLE_SECRET}&code=${authorizationCode}&grant_type=authorization_code&redirect_uri=https://d1ghlpfq71z9hf.cloudfront.net`,
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
        area,
        provider: 'google',
      },
    });
    const [user, created] = exUser;

    const token = jwt.sign(
      {
        id: user.id,
        nick: user.nick,
        email: user.email,
        provider: user.provider,
        area: user.area,
        profileImage: user.profileImage,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
    res.status(200).cookie('access_token', token).json({ access_token: token });
  } catch (err) {
    next(err);
  }
};
