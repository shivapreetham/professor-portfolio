import { NextResponse } from 'next/server';

const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // If no code, redirect to Google OAuth
  if (!code) {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google`,
      scope: 'openid email profile',
      response_type: 'code',
      state: state || 'signin', // signin or signup
    });

    const authUrl = `${GOOGLE_OAUTH_URL}?${params.toString()}`;
    return NextResponse.redirect(authUrl);
  }

  // Exchange code for access token
  try {
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || 'Failed to get access token');
    }

    // Get user info from Google
    const userResponse = await fetch(GOOGLE_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    // Handle user creation/login
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google-signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        googleId: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      }),
    });

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      throw new Error(authData.error || 'Authentication failed');
    }

    // Set cookie and redirect
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/admin`);
    response.cookies.set('auth-token', authData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/error?error=oauth_error`);
  }
}