import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // must be the pooled URL (host has -pooler)
  ssl: { rejectUnauthorized: false }
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();
export default { query, getClient };
