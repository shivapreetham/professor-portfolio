import { db } from '@/utils/db';
import { researchPapers } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET - Fetch all research papers
export async function GET() {
    try {
        const papersListData = await db
            .select()
            .from(researchPapers)
            .orderBy(desc(researchPapers.publishedAt));

        return NextResponse.json(papersListData);
    } catch (error) {
        console.error('Error fetching papers list:', error);
        return NextResponse.json(
            { error: 'Failed to fetch research papers' }, 
            { status: 500 }
        );
    }
}

// POST - Add new research paper
export async function POST(request) {
    try {
        const data = await request.json();
        
        const result = await db.insert(researchPapers).values(data).returning();
        
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error adding research paper:', error);
        return NextResponse.json(
            { error: 'Failed to add research paper' }, 
            { status: 500 }
        );
    }
}

// PUT - Update research paper
export async function PUT(request) {
    try {
        const { id, ...data } = await request.json();
        
        if (!id) {
            return NextResponse.json(
                { error: 'Paper ID is required' }, 
                { status: 400 }
            );
        }
        
        const result = await db
            .update(researchPapers)
            .set(data)
            .where(eq(researchPapers.id, id))
            .returning();
        
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating research paper:', error);
        return NextResponse.json(
            { error: 'Failed to update research paper' }, 
            { status: 500 }
        );
    }
}

// DELETE - Delete research paper
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json(
                { error: 'Paper ID is required' }, 
                { status: 400 }
            );
        }
        
        await db.delete(researchPapers).where(eq(researchPapers.id, id));
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting research paper:', error);
        return NextResponse.json(
            { error: 'Failed to delete research paper' }, 
            { status: 500 }
        );
    }
}