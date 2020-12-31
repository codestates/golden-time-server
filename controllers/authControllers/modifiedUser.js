require('dotenv').config();
const jwt = require('jsonwebtoken');
const { s3 } = require('../../routes/middleware');
const { User } = require('../../models');

module.exports = async (req, res, next) => {
  try {
    const { nick } = req.body;
    const findImage = await User.findOne({
      where: { id: req.user.id },
      attributes: ['profileImage'],
    });
    const fileUrl = findImage.profileImage.split('/');
    const delFileName = fileUrl[fileUrl.length - 1];
    const params = {
      Bucket: 'golden-time-image',
      Key: delFileName,
    };
    if (req.file && findImage.profileImage) {
      s3.deleteObject(params, (err) => {
        if (err) return next(err);
      });
    }
    await User.update(
      {
        nick,
        profileImage: req.file ? req.file.location : findImage.profileImage,
      },
      { where: { id: req.user.id } },
    );
    const updateInfo = await User.findOne({ where: { id: req.user.id } });
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
  } catch (err) {
    next(err);
  }
};
