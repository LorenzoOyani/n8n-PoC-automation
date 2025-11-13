import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

try {
  const res = await pool.query('SELECT NOW()');
  console.log('✅ Connected successfully:', res.rows[0]);
} catch (err) {
  console.error('❌ Database connection failed:', err);
} finally {
  await pool.end();
}
