import { db } from '@/utils/db';
import { achievements } from '@/utils/schema';
import { desc, eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

export async function GET() {
    try {
        const user = await requireAuth();
        const achievementsData = await db
            .select()
            .from(achievements)
            .where(eq(achievements.userId, user.userId))
            .orderBy(desc(achievements.date));

        return NextResponse.json(achievementsData);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch achievements' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}

export async function POST(request) {
    try {
        const user = await requireAuth();
        const data = await request.json();
        
        // Convert date string to Date object if needed
        const achievementData = {
            ...data,
            userId: user.userId,
            date: data.date ? new Date(data.date) : null
        };
        
        const result = await db.insert(achievements).values(achievementData).returning();
        
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
        
        // Convert date string to Date object if needed
        const updateData = {
            ...data,
            date: data.date ? new Date(data.date) : data.date
        };
        
        const result = await db
            .update(achievements)
            .set(updateData)
            .where(and(eq(achievements.id, id), eq(achievements.userId, user.userId)))
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
        
        await db.delete(achievements).where(and(eq(achievements.id, id), eq(achievements.userId, user.userId)));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting achievement:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete achievement' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}