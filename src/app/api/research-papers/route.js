import { db } from '@/utils/db';
import { researchPapers } from '@/utils/schema';
import { desc, eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

// GET - Fetch all research papers
export async function GET() {
    try {
        const user = await requireAuth();
        const papersListData = await db
            .select()
            .from(researchPapers)
            .where(and(eq(researchPapers.userId, user.userId), eq(researchPapers.isPreview, true)))
            .orderBy(desc(researchPapers.publishedAt));

        return NextResponse.json(papersListData);
    } catch (error) {
        console.error('Error fetching papers list:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch research papers' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}

// POST - Add new research paper
export async function POST(request) {
    try {
        const user = await requireAuth();
        const data = await request.json();
        
        // Convert date string to Date object if needed
        const paperData = {
            ...data,
            userId: user.userId,
            publishedAt: data.publishedAt ? new Date(data.publishedAt) : null
        };
        
        const result = await db.insert(researchPapers).values(paperData).returning();
        
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error adding research paper:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to add research paper' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}

// PUT - Update research paper
export async function PUT(request) {
    try {
        const user = await requireAuth();
        const { id, ...data } = await request.json();
        
        if (!id) {
            return NextResponse.json(
                { error: 'Paper ID is required' }, 
                { status: 400 }
            );
        }
        
        // Convert date string to Date object if needed
        const updateData = {
            ...data,
            publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.publishedAt
        };
        
        const result = await db
            .update(researchPapers)
            .set(updateData)
            .where(and(eq(researchPapers.id, id), eq(researchPapers.userId, user.userId)))
            .returning();
        
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating research paper:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update research paper' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}

// DELETE - Delete research paper
export async function DELETE(request) {
    try {
        const user = await requireAuth();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json(
                { error: 'Paper ID is required' }, 
                { status: 400 }
            );
        }
        
        await db.delete(researchPapers).where(and(eq(researchPapers.id, id), eq(researchPapers.userId, user.userId)));
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting research paper:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete research paper' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}