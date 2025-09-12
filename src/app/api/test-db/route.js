import { db, withRetry } from '@/utils/db';
import { user } from '@/utils/schema';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Test basic database connectivity
        const testConnection = await withRetry(async () => {
            const result = await db.select().from(user).limit(1);
            return result;
        });

        return NextResponse.json({ 
            status: 'success', 
            message: 'Database connection successful',
            userCount: testConnection.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Database connection test failed:", error);
        
        return NextResponse.json({ 
            status: 'error',
            message: 'Database connection failed',
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}