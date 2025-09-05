import { db } from '@/utils/db';
import { achievements } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

export async function GET() {
    try {
        const achievementsData = await db
            .select()
            .from(achievements)
            .orderBy(desc(achievements.date));

        return NextResponse.json(achievementsData);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return NextResponse.json(
            { error: 'Failed to fetch achievements' }, 
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const user = await requireAuth();
        const data = await request.json();
        
        const result = await db.insert(achievements).values({
            ...data,
            userId: user.userId
        }).returning();
        
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error adding achievement:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to add achievement' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const user = await requireAuth();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const data = await request.json();
        
        if (!id) {
            return NextResponse.json(
                { error: 'Achievement ID is required' }, 
                { status: 400 }
            );
        }
        
        const result = await db
            .update(achievements)
            .set(data)
            .where(eq(achievements.id, id))
            .returning();
        
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating achievement:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update achievement' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const user = await requireAuth();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json(
                { error: 'Achievement ID is required' }, 
                { status: 400 }
            );
        }
        
        await db.delete(achievements).where(eq(achievements.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting achievement:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete achievement' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}