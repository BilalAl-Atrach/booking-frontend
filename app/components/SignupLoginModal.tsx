"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function SignupLoginModal({ onClose }: { onClose: () => void }) {
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  async function handleSubmit() {
    try {
      const endpoint = isSignup ? "signup" : "login";
      const payload = isSignup
        ? { username, password, name, phone_number: phoneNumber }
        : { username, password };

      const res = await api.post(`/${endpoint}`, payload);
      const data = res.data;
      console.log("Login response:", data);
      if (data.access_token) {
        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("userId", data.user_id.toString());
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userRole", data.role);

        window.dispatchEvent(new Event("authChanged"));
        alert(`${isSignup ? "Signup" : "Login"} successful!`);
        onClose();

        setTimeout(() => {
          if (data.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/booking");
          }
        }, 500);
      } else {
        alert("Failed. Try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert(
        (err as any).response?.data?.detail ||
          "Server not responding. Is FastAPI running?",
      );
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
      {/* ✅ Center modal independently of navbar */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 
                      bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-black 
                      max-h-[90vh] overflow-auto"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          {isSignup ? "Signup" : "Login"}
        </h2>

        {isSignup && (
          <>
            <input
              id="name"
              name="name"
              autoComplete="name"
              className="w-full mb-3 px-3 py-2 border-2 border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              id="phone_number"
              name="phone_number"
              autoComplete="tel"
              className="w-full mb-3 px-3 py-2 border-2 border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </>
        )}

        <input
          id="username"
          name="username"
          autoComplete="username"
          className="w-full mb-3 px-3 py-2 border-2 border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          className="w-full mb-3 px-3 py-2 border-2 border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition"
        >
          {isSignup ? "Signup" : "Login"}
        </button>

        <p
          className="mt-4 text-sm text-blue-600 cursor-pointer hover:underline text-center"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Need an account? Signup"}
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
