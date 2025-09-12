import { db } from '@/utils/db';
import { conferences } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

export async function GET() {
    try {
        const conferencesData = await db
            .select()
            .from(conferences)
            .orderBy(desc(conferences.date));

        return NextResponse.json(conferencesData);
    } catch (error) {
        console.error('Error fetching conferences:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conferences' }, 
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const user = await requireAuth();
        const data = await request.json();
        
        // Convert date string to Date object if needed
        const conferenceData = {
            ...data,
            userId: user.userId,
            date: data.date ? new Date(data.date) : null
        };
        
        const result = await db.insert(conferences).values(conferenceData).returning();
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error adding conference:', error);
        return NextResponse.json(
            { error: 'Failed to add conference' }, 
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
                { error: 'Conference ID is required' }, 
                { status: 400 }
            );
        }
        
        // Convert date string to Date object if needed
        const updateData = {
            ...data,
            date: data.date ? new Date(data.date) : data.date
        };
        
        const result = await db
            .update(conferences)
            .set(updateData)
            .where(eq(conferences.id, id))
            .returning();
        
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating conference:', error);
        return NextResponse.json(
            { error: 'Failed to update conference' }, 
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
                { error: 'Conference ID is required' }, 
                { status: 400 }
            );
        }
        
        await db.delete(conferences).where(eq(conferences.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting conference:', error);
        return NextResponse.json(
            { error: 'Failed to delete conference' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}