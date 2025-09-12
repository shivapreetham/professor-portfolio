// db.js
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'; // Your schema file with table definitions

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is missing! Check your .env file.");
}

// Configure Neon with better timeout and retry settings
const sql = neon(DATABASE_URL, {
    // Increase timeout to 30 seconds
    fetchOptions: {
        timeout: 30000,
    },
    // Add connection pooling
    connectionTimeoutMillis: 30000,
    queryTimeoutMillis: 30000,
});

export const db = drizzle(sql, { schema });

// Helper function to retry database operations
export async function withRetry(operation, retries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            console.error(`Database operation attempt ${attempt} failed:`, error.message);
            
            if (attempt === retries) {
                throw error;
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }
}
