module.exports = (req, res) => {
  req.session.destroy();
  res.clearCookie();
  res.send({ message: 'successfully LOGOUT!' });
};
