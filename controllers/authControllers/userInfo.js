const fs = require('fs');

module.exports = (req, res) => {
  console.log(req.user);
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
};
