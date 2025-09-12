"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FormContent from "./components/FormContent";
import MobilePreview from "./components/MobilePreview";
import CustomizationSidebar from "./components/CustomizationSidebar";
import { LoadingSpinner } from "@/components/ui/loading";
import { useUser } from "./Provider";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const userData = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth"); // Redirect to proper auth page if not authenticated
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner />; // Show loading while checking auth
  if (!user) return null; // Prevent flickering before redirect

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Sidebar: Theme & Content customization */}
        <div className="xl:col-span-1">
          <div className="sticky top-4">
            <CustomizationSidebar userInfo={userData?.user} />
          </div>
        </div>
        
        {/* Main content: Form content */}
        <div className="xl:col-span-2"> 
          <FormContent />
        </div>
        
        {/* Right side: Mobile preview */}
        <div className="xl:col-span-1">
          <MobilePreview />
        </div>
      </div>
    </div>
  );
}
