import { NextResponse } from 'next/server'
import { db } from '@/utils/dbConnect'
import { user } from '@/utils/schema'
import { verifyPassword, signToken } from '@/lib/auth'
import { eq } from 'drizzle-orm'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1)

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const userRecord = existingUser[0]

    // Verify password
    const isValidPassword = await verifyPassword(password, userRecord.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = await signToken({
      userId: userRecord.id,
      email: userRecord.email,
      name: userRecord.name
    })

    // Create response without password
    const { password: _, ...userWithoutPassword } = userRecord

    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}