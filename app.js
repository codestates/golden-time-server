require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const { sequelize } = require('./models');
const authRouter = require('./routes/auth');
const goodsRouter = require('./routes/goods');
const commentsRouter = require('./routes/comments');
const categoryRouter = require('./routes/category');
const searchRouter = require('./routes/search');
const configPassport = require('./passport');

const app = express();
sequelize.sync();
configPassport(passport);

app.set('port', process.env.PORT || 8088);

if (process.env.NODE_ENV === 'production') {
  app.use(logger('combine'));
} else {
  app.use(logger('dev'));
}
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
    credentials: true,
  }),
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static('./uploads'));

app.use('/auth', authRouter);
app.use('/goods', goodsRouter);
app.use('/comments', commentsRouter);
app.use('/category', categoryRouter);
app.use('/search', searchRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ redirect_url: '/error' });
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트에서 서버 대기 중`);
});
