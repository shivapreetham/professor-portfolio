// db.js
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'; // Your schema file with table definitions


const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is missing! Check your .env file.");
}

// Use the connection URL from your environment variables
const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });
