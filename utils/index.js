// db.js
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../utils/schema'; // Your schema file with table definitions

// Use the connection URL from your environment variables
const sql = neon(process.env.DATABASE_URL);
// Alternatively, if you prefer to build the URL from individual env vars, you can do that here.
export const db = drizzle(sql, schema);
