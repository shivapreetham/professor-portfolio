"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FormContent from "./components/FormContent";
import MobilePreview from "./components/MobilePreview";
import { LoadingSpinner } from "@/components/ui/loading";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth"); // Redirect to proper auth page if not authenticated
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner />; // Show loading while checking auth
  if (!user) return null; // Prevent flickering before redirect

  return (
    <div className="p-7">
    <div className="grid grid-cols-1 lg:grid-cols-3">
      {/* Left side: Form content */}
      <div className="col-span-2"> 
        <FormContent />
      </div>
      {/* Right side: Mobile preview */}
      <div>
        <MobilePreview />
      </div>
    </div>
    </div>
  );
}
