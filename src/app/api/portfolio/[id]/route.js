import { NextResponse } from 'next/server'
import { db } from '@/utils/db'
import { 
  user, 
  projects, 
  researchPapers, 
  conferences, 
  achievements, 
  blogPosts, 
  awards 
} from '@/utils/schema'
import { eq } from 'drizzle-orm'

export async function GET(request, { params }) {
  try {
    const { id } = params

    // Fetch user data (without password)
    const userData = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        location: user.location,
        linkedIn: user.linkedIn,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, id))
      .limit(1)

    if (userData.length === 0) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // Fetch all related data in parallel
    const [
      userProjects,
      userResearchPapers,
      userConferences,
      userAchievements,
      userBlogPosts,
      userAwards,
    ] = await Promise.all([
      db.select().from(projects).where(eq(projects.userId, id)),
      db.select().from(researchPapers).where(eq(researchPapers.userId, id)),
      db.select().from(conferences).where(eq(conferences.userId, id)),
      db.select().from(achievements).where(eq(achievements.userId, id)),
      db.select().from(blogPosts).where(eq(blogPosts.userId, id)),
      db.select().from(awards).where(eq(awards.userId, id)),
    ])

    const portfolioData = {
      user: userData[0],
      projects: userProjects,
      researchPapers: userResearchPapers,
      conferences: userConferences,
      achievements: userAchievements,
      blogPosts: userBlogPosts,
      awards: userAwards,
    }

    return NextResponse.json(portfolioData)
  } catch (error) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}