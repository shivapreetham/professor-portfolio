import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { user } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { googleId, email, name, picture } = await request.json();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    let userRecord;

    if (existingUser.length > 0) {
      // User exists, update their profile image if needed
      userRecord = existingUser[0];
      if (picture && userRecord.profileImage !== picture) {
        await db
          .update(user)
          .set({
            profileImage: picture,
            updatedAt: new Date()
          })
          .where(eq(user.id, userRecord.id));
        userRecord.profileImage = picture;
      }
    } else {
      // Create new user
      const newUser = await db
        .insert(user)
        .values({
          name: name || email.split('@')[0],
          email,
          password: null, // Google users don't have passwords
          profileImage: picture,
          bio: null,
          location: null,
          linkedIn: null,
        })
        .returning();

      userRecord = newUser[0];
    }

    // Generate JWT token
    const token = await signToken({
      userId: userRecord.id,
      email: userRecord.email,
      name: userRecord.name
    });

    return NextResponse.json({
      message: 'Google sign-in successful',
      token,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        profileImage: userRecord.profileImage,
      }
    });

  } catch (error) {
    console.error('Google sign-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}