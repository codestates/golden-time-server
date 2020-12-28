const fs = require('fs');

module.exports = (req, res) => {
  try {
    const { id, email, nick, profileImage, provider, area, createdAt } = req.user;

    res.status(200).json({
      id,
      email,
      nick,
      profileImage,
      provider,
      area,
      createdAt,
    });
  } catch (err) {
    res.status(400).json({ message: 'failed' });
  }
};
