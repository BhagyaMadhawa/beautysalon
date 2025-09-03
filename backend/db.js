// backend/db.js (ESM)
import pkg from 'pg';
const { Pool } = pkg;

const {
  DATABASE_URL,        // optional
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_PORT
} = process.env;

const pool = DATABASE_URL
  ? new Pool({ connectionString: DATABASE_URL })
  : new Pool({
      user: DB_USER,
      host: DB_HOST,
      database: DB_NAME,
      // If your local Postgres uses trust/peer auth, you can omit password entirely:
      ...(DB_PASS ? { password: DB_PASS } : {}),
      port: DB_PORT ? Number(DB_PORT) : 5432,
    });

export const query = (text, params) => pool.query(text, params);
export const getClient = async () => pool.connect();
export default { query, getClient };
