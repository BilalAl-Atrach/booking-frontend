"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "../lib/api";

export default function SignupLoginModal({ onClose }: { onClose: () => void }) {
  const [isSignup, setIsSignup] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit() {
    try {
      const endpoint = isSignup ? "signup" : "login";
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      const trimmedName = name.trim();
      const trimmedPhoneNumber = phoneNumber.trim();

      if (!trimmedUsername || !trimmedPassword) {
        alert("Please fill in username and password.");
        return;
      }

      if (isSignup && (!trimmedName || !trimmedPhoneNumber)) {
        alert("Please fill in full name and phone number.");
        return;
      }

      const payload = isSignup
        ? {
            username: trimmedUsername,
            password: trimmedPassword,
            name: trimmedName,
            phone_number: trimmedPhoneNumber,
          }
        : { username: trimmedUsername, password: trimmedPassword };

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
        (axios.isAxiosError(err) && err.response?.data?.detail) ||
          "Server not responding. Is FastAPI running?",
      );
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/55 px-4 py-4 backdrop-blur-sm sm:py-6">
      <div className="w-full max-w-md overflow-y-auto rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200 max-h-[calc(100dvh-2rem)] sm:max-h-[90vh]">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                {isSignup ? "Create account" : "Welcome back"}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                {isSignup ? "Sign up to BookAI" : "Login to BookAI"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {isSignup
                  ? "Fill your details to reserve appointments."
                  : "Use your username and password to continue."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              aria-label="Close"
            >
              x
            </button>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setIsSignup(true)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isSignup
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                !isSignup
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Login
            </button>
          </div>

          {isSignup && (
            <>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                required
                className="mb-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label
                htmlFor="phone_number"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Phone number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                autoComplete="tel"
                required
                className="mb-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </>
          )}

          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            className="mb-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            className="mb-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-cyan-600 active:scale-[0.99]"
          >
            {isSignup ? "Create Account" : "Login"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </p>

          <button
            onClick={onClose}
            className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
