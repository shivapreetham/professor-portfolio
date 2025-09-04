import { db } from '@/utils/db';
import { blogPosts } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const blogsData = await db
            .select()
            .from(blogPosts)
            .orderBy(desc(blogPosts.publishedAt));

        return NextResponse.json(blogsData);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog posts' }, 
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const result = await db.insert(blogPosts).values(data).returning();
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error adding blog post:', error);
        return NextResponse.json(
            { error: 'Failed to add blog post' }, 
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const { id, ...data } = await request.json();
        
        if (!id) {
            return NextResponse.json(
                { error: 'Blog post ID is required' }, 
                { status: 400 }
            );
        }
        
        const result = await db
            .update(blogPosts)
            .set(data)
            .where(eq(blogPosts.id, id))
            .returning();
        
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating blog post:', error);
        return NextResponse.json(
            { error: 'Failed to update blog post' }, 
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
                { error: 'Blog post ID is required' }, 
                { status: 400 }
            );
        }
        
        await db.delete(blogPosts).where(eq(blogPosts.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json(
            { error: 'Failed to delete blog post' }, 
            { status: 500 }
        );
    }
}