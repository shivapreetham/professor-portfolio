import { db } from '@/utils/db'
import { user, projects, achievements, conferences, blogPosts } from '@/utils/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { id: userId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      )
    }

    // Fetch user data and all their PREVIEW content in parallel
    const [
      userData,
      userProjects,
      userAchievements,
      userConferences,
      userBlogPosts
    ] = await Promise.all([
      db.select().from(user).where(eq(user.id, userId)).limit(1),
      db.select().from(projects).where(and(eq(projects.userId, userId), eq(projects.isPreview, true))),
      db.select().from(achievements).where(and(eq(achievements.userId, userId), eq(achievements.isPreview, true))),
      db.select().from(conferences).where(and(eq(conferences.userId, userId), eq(conferences.isPreview, true))),
      db.select().from(blogPosts).where(and(eq(blogPosts.userId, userId), eq(blogPosts.isPreview, true)))
    ])

    if (userData.length === 0) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      )
    }

    // Remove sensitive data from user object
    const { password, ...safeUserData } = userData[0]

    const responseData = {
      user: safeUserData,
      projects: userProjects,
      achievements: userAchievements,
      conferences: userConferences,
      blogPosts: userBlogPosts
    }

    // Add cache headers for better performance
    const response = NextResponse.json(responseData)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    
    return response
  } catch (error) {
    console.error('Error fetching preview data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preview data' }, 
      { status: 500 }
    )
  }
}