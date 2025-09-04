'use client'
import { db } from '@/utils/db'
import { 
  user, projects, researchPapers, conferences, 
  achievements, blogPosts, teachingExperience, 
  awards, collaborations 
} from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDataSync } from '@/contexts/DataSyncContext'

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

const Provider = ({ children }) => {
    const { user: authUser } = useAuth();
    const { registerRefreshCallback } = useDataSync();
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

    const getUserData = async (userId) => {
        if (!userId) return;
        
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
        if (authUser?.id) {
            getUserData(authUser.id);
        }
    }, [authUser]);

    // Register for real-time updates
    useEffect(() => {
        if (authUser?.id) {
            const unregister = registerRefreshCallback(() => {
                getUserData(authUser.id);
            });
            
            return unregister;
        }
    }, [authUser?.id, registerRefreshCallback]);

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
}

export default Provider;