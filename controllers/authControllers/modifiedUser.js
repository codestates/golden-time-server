require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

module.exports = async (req, res) => {
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
  res.status(200).cookie('access_token', token).json({ access_token: token });
};
