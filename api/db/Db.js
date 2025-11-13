// const {Pool} = require('pg');
//
// const pool = new Pool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     max: 20, // Maximum number of clients in the pool
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 2000,
// });
//
// pool.on('connect', (conn) => {
//     console.log(`Connected to database`);
// })
//
// pool.on('error', (err) => {
//     console.error(`Failed to connect to database: ${err}`);
// })
//
// module.exports = pool;