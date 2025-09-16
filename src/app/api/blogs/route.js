import { db } from '@/utils/db';
import { blogPosts } from '@/utils/schema';
import { desc, eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';

export async function GET() {
    try {
        const user = await requireAuth();
        const blogsData = await db
            .select()
            .from(blogPosts)
            .where(and(eq(blogPosts.userId, user.userId), eq(blogPosts.isPreview, true)))
            .orderBy(desc(blogPosts.createdAt));

        return NextResponse.json(blogsData);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch blog posts' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}

export async function POST(request) {
    try {
        const user = await requireAuth();
        const data = await request.json();
        
        // Add user ID to the data
        const blogData = {
            ...data,
            userId: user.userId
        };
        
        const result = await db.insert(blogPosts).values(blogData).returning();
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error adding blog post:', error);
        return NextResponse.json(
            { error: 'Failed to add blog post' }, 
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
                { error: 'Blog post ID is required' }, 
                { status: 400 }
            );
        }
        
        const result = await db
            .update(blogPosts)
            .set(data)
            .where(and(eq(blogPosts.id, id), eq(blogPosts.userId, user.userId)))
            .returning();
        
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error updating blog post:', error);
        return NextResponse.json(
            { error: 'Failed to update blog post' }, 
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
                { error: 'Blog post ID is required' }, 
                { status: 400 }
            );
        }
        
        await db.delete(blogPosts).where(and(eq(blogPosts.id, id), eq(blogPosts.userId, user.userId)));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json(
            { error: 'Failed to delete blog post' }, 
            { status: error.message === 'Authentication required' ? 401 : 500 }
        );
    }
}