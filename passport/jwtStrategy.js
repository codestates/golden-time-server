require('dotenv').config();
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('../models');

module.exports = (passport) => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          console.log(jwt_payload);
          const exUser = await User.findOne({ where: { id: jwt_payload.id } });
          if (!exUser) {
            done(null, false);
          } else {
            done(null, exUser);
          }
        } catch (err) {
          done(err);
        }
      },
    ),
  );
};
