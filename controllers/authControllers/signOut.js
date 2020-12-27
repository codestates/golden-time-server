module.exports = (req, res) => {
  console.log(req.cookies);
  if (Object.keys(req.cookies).length === 0) {
    res.status(400).send({ message: 'not authorized' });
  } else {
    req.session.destroy(() => {
      req.session;
    });
    res.clearCookie();
    res.send({ message: 'successfully LOGOUT!' });
  }
};
