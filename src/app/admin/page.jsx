"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormContent from "./components/FormContent";
import MobilePreview from "./components/MobilePreview";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");
    if (auth === "true") {
      setIsAuthorized(true);
    } else {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [router]);

  if (!isAuthorized) return null; // Prevent flickering before redirect

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
