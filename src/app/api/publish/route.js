import { db } from '@/utils/db'
import { user } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'

export async function POST(request) {
  try {
    const currentUser = await requireAuth()
    const { isPublished } = await request.json()

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