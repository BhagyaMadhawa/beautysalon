// backend/db.js (ESM, for Vercel serverless functions)
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Neon serverless client
export const sql = neon(process.env.DATABASE_URL);

// Helper to mimic pg.query style
export const query = async (text, params = []) => {
  if (!params.length) {
    return sql(text);                 // sql`select 1`
  }
  return sql(text, params);           // sql('select $1', [value])
};

export default { sql, query };
