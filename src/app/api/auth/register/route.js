import { NextResponse } from 'next/server'
import { db } from '@/utils/dbConnect'
import { user } from '@/utils/schema'
import { hashPassword, signToken } from '@/lib/auth'
import { eq } from 'drizzle-orm'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser = await db
      .insert(user)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        location: user.location,
        linkedIn: user.linkedIn,
        createdAt: user.createdAt,
      })

    if (newUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Generate JWT token
    const token = await signToken({
      userId: newUser[0].id,
      email: newUser[0].email,
      name: newUser[0].name
    })

    // Create response
    const response = NextResponse.json({
      message: 'User created successfully',
      user: newUser[0]
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
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}