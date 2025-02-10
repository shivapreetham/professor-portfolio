import React , {useEffect} from 'react';
import {db} from '@/utils/db';
import { projects } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import {user} from '@/utils/schema';

function Provider({children}) {
    const [userInfo, setUserInfo] = useState(null);
    useEffect(()=>{
        console.log("Provider mounted"); // Add this to check mounting
        GetUserDetails();
    }, []);
    const GetUserDetails= async()=>{
        try {
            const userDetails = await db.select().from(user).where(eq(user.id, "1"));
            console.log("DB user:", userDetails); // Add this to check DB response
            setUserInfo(userDetails[0]);
        } catch(error) {
            console.error("Failed to fetch user:", error);
        }
    }

    useEffect(()=>{
        GetProjectList();
    }, []);

    const GetProjectList = async()=>{
        try {
            const projectDetails = await db.select().from(projects).where(eq(user.id, "1"));
            console.log("DB projects:", projectDetails); // Add this to check DB response
            setUserInfo(projectDetails[0]);
        } catch(error) {
            console.error("Failed to fetch user:", error);
        }
    }

    return (
        <div>
            {children}
        </div>
    );
}