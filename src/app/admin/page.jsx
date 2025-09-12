"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FormContent from "./components/FormContent";
import MobilePreview from "./components/MobilePreview";
import SideNav from "./components/SideNav";
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
    <div className="min-h-screen bg-base-100">
      {/* Consolidated Side Navigation with All Features */}
      <SideNav />
      
      {/* Main Layout - Responsive spacing for sidebar */}
      <div className="transition-all duration-300 pl-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Main content: Form content - Takes more space */}
          <div className="lg:col-span-2"> 
            <FormContent />
          </div>
          
          {/* Right side: Mobile preview */}
          <div className="lg:col-span-1">
            <MobilePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
