import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Add password column if it doesn't exist
    await sql`
      ALTER TABLE "user" 
      ADD COLUMN IF NOT EXISTS "password" varchar(255) DEFAULT '';
    `;
    
    return NextResponse.json({ success: true, message: 'Password column added' });
  } catch (error) {
    console.error('Error adding password column:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}