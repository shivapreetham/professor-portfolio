import { db } from '@/utils/db';
import { projects } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

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
        const data = await request.json();
        const result = await db.insert(projects).values(data).returning();
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error adding project:', error);
        return NextResponse.json(
            { error: 'Failed to add project' }, 
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const { id, ...data } = await request.json();
        
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
            { error: 'Failed to update project' }, 
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
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
            { error: 'Failed to delete project' }, 
            { status: 500 }
        );
    }
}