'use client'
import { db } from '@/utils/db'
import { 
  user, projects, researchPapers, conferences, 
  achievements, blogPosts, teachingExperience, 
  awards, collaborations 
} from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

const Provider = ({ children }) => {
    const [userData, setUserData] = useState({
        user: null,
        projects: [],
        researchPapers: [],
        conferences: [],
        achievements: [],
        blogPosts: [],
        teachingExperience: [],
        awards: [],
        collaborations: []
    });

    const getUserData = async () => {
        try {
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
                db.select().from(user).where(eq(user.id, "1")),
                db.select().from(projects).where(eq(projects.userId, "1")),
                db.select().from(researchPapers).where(eq(researchPapers.userId, "1")),
                db.select().from(conferences).where(eq(conferences.userId, "1")),
                db.select().from(achievements).where(eq(achievements.userId, "1")),
                db.select().from(blogPosts).where(eq(blogPosts.userId, "1")),
                db.select().from(teachingExperience).where(eq(teachingExperience.userId, "1")),
                db.select().from(awards).where(eq(awards.userId, "1")),
                db.select().from(collaborations).where(eq(collaborations.userId, "1"))
            ]);

            setUserData({
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
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
}

export default Provider;