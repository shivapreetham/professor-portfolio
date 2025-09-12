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
import { eq, and } from 'drizzle-orm'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Fetch user data (without password) - only if published
    const userData = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        location: user.location,
        linkedIn: user.linkedIn,
        theme: user.theme,
        primaryColor: user.primaryColor,
        customCSS: user.customCSS,
        heroTitle: user.heroTitle,
        heroSubtitle: user.heroSubtitle,
        sectionsOrder: user.sectionsOrder,
        sectionVisibility: user.sectionVisibility,
        isPublished: user.isPublished,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, id))
      .limit(1)

    if (userData.length === 0 || !userData[0].isPublished) {
      return NextResponse.json(
        { error: 'Portfolio not found or not published' },
        { status: 404 }
      )
    }

    // Fetch all PUBLISHED related data in parallel
    const [
      userProjects,
      userResearchPapers,
      userConferences,
      userAchievements,
      userBlogPosts,
      userAwards,
    ] = await Promise.all([
      db.select().from(projects).where(and(eq(projects.userId, id), eq(projects.isPreview, false))),
      db.select().from(researchPapers).where(and(eq(researchPapers.userId, id), eq(researchPapers.isPreview, false))),
      db.select().from(conferences).where(and(eq(conferences.userId, id), eq(conferences.isPreview, false))),
      db.select().from(achievements).where(and(eq(achievements.userId, id), eq(achievements.isPreview, false))),
      db.select().from(blogPosts).where(and(eq(blogPosts.userId, id), eq(blogPosts.isPreview, false))),
      db.select().from(awards).where(eq(awards.userId, id)), // Awards table doesn't have isPreview yet
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