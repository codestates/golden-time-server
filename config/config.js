require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: DB_DATABASE,
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: process.env.PRODUCTION_DB_USERNAME,
    password: process.env.PRODUCTION_DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.PRODUCTION_PORT,
    host: process.env.PRODUCTION_DB_HOST,
    dialect: 'mysql',
    logging: false,
  },
};
