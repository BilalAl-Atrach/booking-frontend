"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SignupLoginModal from "./SignupLoginModal";

export default function Navbar({ hideLinks = false }: { hideLinks?: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const name = localStorage.getItem("userName");
      const id = localStorage.getItem("userId");

      if (token) {
        setIsAuthenticated(true);
        setUserName(name || "");
        setUserId(id || "");
      } else {
        setIsAuthenticated(false);
        setUserName("");
        setUserId("");
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChanged", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserName("");
    window.dispatchEvent(new Event("authChanged"));
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur border-b border-slate-600">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Website Name */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
          BookAI
        </h1>

        {/* Center: Navigation Links (hidden on admin pages) */}
        {!hideLinks && (
          <div className="flex justify-center items-center gap-8 text-white font-medium">
            <Link href="/" className="px-4 hover:text-cyan-400 transition">Home</Link>
            <Link href="/booking" className="px-4 hover:text-cyan-400 transition">Booking</Link>
            <Link href="/chat" className="px-4 hover:text-cyan-400 transition">Chatbot</Link>
            <Link href="/contact" className="px-4 hover:text-cyan-400 transition">Contact Us</Link>
          </div>
        )}

        {/* Right: Auth UI */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="text-right">
                <p className="text-sm text-slate-400">
                  Welcome {userName} - ID: {userId}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-semibold transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-semibold text-white transition"
            >
              Sign Up / Login
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && <SignupLoginModal onClose={() => setShowModal(false)} />}
    </nav>
  );
}
