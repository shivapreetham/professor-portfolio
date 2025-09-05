"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the proper auth page
    router.replace('/auth');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Redirecting...</h2>
          <p className="text-gray-500 mt-2">Taking you to the login page</p>
          <div className="loading loading-spinner loading-md mt-4"></div>
        </div>
      </div>
    </div>
  );
}
