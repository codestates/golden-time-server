require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const { sequelize } = require('./models');
const passportConfig = require('./passport');
const authRouter = require('./routes/auth');
const goodsRouter = require('./routes/goods');
const commentsRouter = require('./routes/comments');
const categoryRouter = require('./routes/category');
const searchRouter = require('./routes/search');
// const { sequelize } = require('./models');
const configPassport = require('./passport');

const app = express();
sequelize.sync();
configPassport(passport);


const { PORT, COOKIE_SECRET } = process.env;

app.use(logger('dev'));
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  }),
);
app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/goods', goodsRouter);
app.use('/comments', commentsRouter);
app.use('/category', categoryRouter);
app.use('/search', searchRouter);

app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버 대기 중`);
});
