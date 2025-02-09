// db.js
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'; // Your schema file with table definitions
const DATABASE_URL='postgresql://neondb_owner:npg_eiPh74BFjTtw@ep-odd-river-a1cx6453-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is missing! Check your .env file.");
  }
// Use the connection URL from your environment variables
const sql = neon(DATABASE_URL);
// Alternatively, if you prefer to build the URL from individual env vars, you can do that here.
export const db = drizzle(sql, schema);
