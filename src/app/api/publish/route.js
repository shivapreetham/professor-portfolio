import { db } from '@/utils/db'
import { user, projects, achievements, conferences, blogPosts, researchPapers } from '@/utils/schema'
import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'

export async function POST(request) {
  try {
    const currentUser = await requireAuth()
    const { isPublished } = await request.json()

    if (isPublished) {
      // When publishing, copy all preview data to published data
      console.log('Publishing portfolio - copying preview to published data')
      
      // First, delete existing published data
      await Promise.all([
        db.delete(projects).where(and(eq(projects.userId, currentUser.userId), eq(projects.isPreview, false))),
        db.delete(achievements).where(and(eq(achievements.userId, currentUser.userId), eq(achievements.isPreview, false))),
        db.delete(conferences).where(and(eq(conferences.userId, currentUser.userId), eq(conferences.isPreview, false))),
        db.delete(blogPosts).where(and(eq(blogPosts.userId, currentUser.userId), eq(blogPosts.isPreview, false))),
        db.delete(researchPapers).where(and(eq(researchPapers.userId, currentUser.userId), eq(researchPapers.isPreview, false)))
      ])

      // Fetch all preview data
      const [previewProjects, previewAchievements, previewConferences, previewBlogPosts, previewResearchPapers] = await Promise.all([
        db.select().from(projects).where(and(eq(projects.userId, currentUser.userId), eq(projects.isPreview, true))),
        db.select().from(achievements).where(and(eq(achievements.userId, currentUser.userId), eq(achievements.isPreview, true))),
        db.select().from(conferences).where(and(eq(conferences.userId, currentUser.userId), eq(conferences.isPreview, true))),
        db.select().from(blogPosts).where(and(eq(blogPosts.userId, currentUser.userId), eq(blogPosts.isPreview, true))),
        db.select().from(researchPapers).where(and(eq(researchPapers.userId, currentUser.userId), eq(researchPapers.isPreview, true)))
      ])

      // Copy preview data as published data
      const publishPromises = []
      
      if (previewProjects.length > 0) {
        const publishedProjects = previewProjects.map(({ id, ...project }) => ({ 
          ...project, 
          isPreview: false 
        }))
        publishPromises.push(db.insert(projects).values(publishedProjects))
      }
      
      if (previewAchievements.length > 0) {
        const publishedAchievements = previewAchievements.map(({ id, ...achievement }) => ({ 
          ...achievement, 
          isPreview: false 
        }))
        publishPromises.push(db.insert(achievements).values(publishedAchievements))
      }
      
      if (previewConferences.length > 0) {
        const publishedConferences = previewConferences.map(({ id, ...conference }) => ({ 
          ...conference, 
          isPreview: false 
        }))
        publishPromises.push(db.insert(conferences).values(publishedConferences))
      }
      
      if (previewBlogPosts.length > 0) {
        const publishedBlogPosts = previewBlogPosts.map(({ id, ...post }) => ({ 
          ...post, 
          isPreview: false 
        }))
        publishPromises.push(db.insert(blogPosts).values(publishedBlogPosts))
      }
      
      if (previewResearchPapers.length > 0) {
        const publishedResearchPapers = previewResearchPapers.map(({ id, ...paper }) => ({ 
          ...paper, 
          isPreview: false 
        }))
        publishPromises.push(db.insert(researchPapers).values(publishedResearchPapers))
      }

      await Promise.all(publishPromises)
    }

    // Update the user's published status
    const result = await db
      .update(user)
      .set({ 
        isPublished: isPublished,
        updatedAt: new Date()
      })
      .where(eq(user.id, currentUser.userId))
      .returning()

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      isPublished: result[0].isPublished,
      message: isPublished ? 'Portfolio published successfully!' : 'Portfolio unpublished successfully!'
    })
  } catch (error) {
    console.error('Error updating publish status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update publish status' }, 
      { status: error.message === 'Authentication required' ? 401 : 500 }
    )
  }
}