import { db } from '@/utils/db';
import { projects } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

export async function GET() {
    try {
        const projectsData = await db
            .select()
            .from(projects)
            .orderBy(desc(projects.createdAt));

        return NextResponse.json(projectsData);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' }, 
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const user = await requireAuth();
        const data = await request.json();
        
        const result = await db.insert(projects).values({
            ...data,
            userId: user.userId
        }).returning();
        
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error adding project:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to add project' }, 
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
                { error: 'Project ID is required' }, 
                { status: 400 }
            );
        }
        
        const result = await db
            .update(projects)
            .set(data)
            .where(eq(projects.id, id))
            .returning();
        
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update project' }, 
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
                { error: 'Project ID is required' }, 
                { status: 400 }
            );
        }
        
        await db.delete(projects).where(eq(projects.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete project' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}