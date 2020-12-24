module.exports = (req, res) => {
  console.log(req.user.id);
  const { id, email, nick, profileImage, provider, createdAt } = req.user;

  res.status(200).json({
    id,
    email,
    nick,
    profile: profileImage,
    provider,
    createdAt,
  });
};
