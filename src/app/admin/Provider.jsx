'use client'
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
            const response = await fetch(`/api/user/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            setUserData(data);
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