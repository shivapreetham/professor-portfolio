"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative">
        {/* Logout Button - Positioned at the Top Right */}
        <button
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition duration-200"
          onClick={() => {
            localStorage.removeItem("admin-auth");
            router.push("/login");
          }}
        >
          Logout
        </button>

        <h1 className="text-3xl font-bold text-gray-800 text-center">Admin Panel</h1>
        <p className="text-gray-600 text-center mt-2">Manage your application here</p>
        
        <div className="mt-6 text-center">
          <p className="text-lg font-medium">Welcome, Admin! 🎉</p>
        </div>
      </div>
    </div>
  );
}
