module.exports = (req, res) => {
  try {
    if (Object.keys(req.cookies).length === 0) {
      res.status(400).send({ message: 'not authorized' });
    } else {
      req.session.destroy(() => {
        req.session;
      });
      res.clearCookie();
      res.send({ message: 'successfully LOGOUT!' });
    }
  } catch (err) {
    res.status(400).json({ message: 'failed' });
  }
};
