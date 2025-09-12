import { db, withRetry } from '@/utils/db';
import { userInteractions } from '@/utils/schema';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { 
            userId, 
            visitorId, 
            interactionType, 
            targetElement, 
            targetId, 
            metadata 
        } = await request.json();
        
        if (!userId || !visitorId || !interactionType) {
            return NextResponse.json({ 
                error: 'UserId, visitorId, and interactionType are required' 
            }, { status: 400 });
        }

        await withRetry(async () => {
            await db.insert(userInteractions).values({
                userId,
                visitorId,
                interactionType,
                targetElement,
                targetId,
                metadata: metadata ? JSON.stringify(metadata) : null,
            });
        });

        return NextResponse.json({ success: true });
        
    } catch (error) {
        console.error('Error tracking interaction:', error);
        return NextResponse.json({ error: 'Failed to track interaction' }, { status: 500 });
    }
}