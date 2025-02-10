// Provider.jsx
'use client'
import { db } from '@/utils/db'
import { user } from '@/utils/schema'
import { eq } from 'drizzle-orm' // Add this
import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

const Provider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        console.log("Provider mounted"); // Add this to check mounting
        GetUserDetails();
    }, []);

    const GetUserDetails = async() => {
        console.log("Fetching user details"); // Add this to check function call
        try {
            const result = await db.select().from(user).where(eq(user.id, "1"));
            console.log("DB Result:", result); // Add this to check DB response
            setUserInfo(result[0]);
        } catch(error) {
            console.error("Failed to fetch user:", error);
        }
    }

    return (
        <UserContext.Provider value={userInfo}>
            {children}
        </UserContext.Provider>
    );
}

export default Provider;