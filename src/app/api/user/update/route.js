import { db } from '@/utils/db';
import { user } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(request) {
    try {
        const { userId, fieldName, value } = await request.json();
        
        if (!userId || !fieldName || value === undefined) {
            return NextResponse.json({ 
                error: 'userId, fieldName, and value are required' 
            }, { status: 400 });
        }

        const result = await db.update(user)
            .set({ [fieldName]: value })
            .where(eq(user.id, userId));

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ 
            error: 'Failed to update user data' 
        }, { status: 500 });
    }
}