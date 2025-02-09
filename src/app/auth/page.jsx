"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const adminUser = "admin"; // Set your admin username
    const adminPass = "password123"; // Set your admin password

    if (username === adminUser && password === adminPass) {
      localStorage.setItem("admin-auth", "true");
      router.push("/admin"); // Redirect to admin page
    } else {
      setError("Invalid username or password!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">Admin Login</h2>
        <p className="text-gray-500 text-center mb-6">Enter your credentials to access the admin panel</p>

        {error && <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">{error}</p>}

        <div className="relative mt-4">
          <FaUser className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Username"
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="relative mt-4">
          <FaLock className="absolute left-3 top-3 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-200"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
