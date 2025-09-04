import { db } from '@/utils/db';
import { 
    user, projects, researchPapers, conferences, 
    achievements, blogPosts, teachingExperience, 
    awards, collaborations 
} from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const userId = params.id;
        
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const [
            userResult,
            projectsResult,
            papersResult,
            conferencesResult,
            achievementsResult,
            postsResult,
            teachingResult,
            awardsResult,
            collaborationsResult
        ] = await Promise.all([
            db.select().from(user).where(eq(user.id, userId)),
            db.select().from(projects).where(eq(projects.userId, userId)),
            db.select().from(researchPapers).where(eq(researchPapers.userId, userId)),
            db.select().from(conferences).where(eq(conferences.userId, userId)),
            db.select().from(achievements).where(eq(achievements.userId, userId)),
            db.select().from(blogPosts).where(eq(blogPosts.userId, userId)),
            db.select().from(teachingExperience).where(eq(teachingExperience.userId, userId)),
            db.select().from(awards).where(eq(awards.userId, userId)),
            db.select().from(collaborations).where(eq(collaborations.userId, userId))
        ]);

        return NextResponse.json({
            user: userResult[0],
            projects: projectsResult,
            researchPapers: papersResult,
            conferences: conferencesResult,
            achievements: achievementsResult,
            blogPosts: postsResult,
            teachingExperience: teachingResult,
            awards: awardsResult,
            collaborations: collaborationsResult
        });
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
}