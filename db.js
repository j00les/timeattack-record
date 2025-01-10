const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.PG_USER_DEV,
//   host: process.env.PG_HOST_DEV,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD_DEV,
//   port: process.env.PG_PASSWORD_HOST
// });

//its working
const pool = new Pool({
  user: process.env.PG_USER_PROD,
  host: process.env.PG_HOST_PROD,
  database: process.env.PG_DATABASE_PROD,
  password: process.env.PG_PASSWORD_PROD,
  port: process.env.PG_PORT_PROD
});

module.exports = pool;
