"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SignupLoginModal from "./SignupLoginModal";

export default function Navbar({ hideLinks = false }: { hideLinks?: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/booking", label: "Booking" },
    { href: "/chat", label: "Chatbot" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur border-b border-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        {/* Left: Website Name */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          BookAI
        </Link>

        {/* Center: Navigation Links (hidden on admin pages) */}
        {!hideLinks && (
          <div className="hidden lg:flex justify-center items-center gap-4 text-white font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 hover:text-cyan-400 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right: Auth UI */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:block text-right">
                <p className="text-xs lg:text-sm text-slate-400 max-w-48 truncate">
                  Welcome {userName} - ID: {userId}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-semibold transition-all duration-200 text-sm sm:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-semibold text-white transition text-sm sm:text-base whitespace-nowrap"
            >
              <span className="hidden sm:inline">Sign Up / Login</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}

          {!hideLinks && (
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="lg:hidden w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Menu</span>
              <span className="block w-5">
                <span className="block h-0.5 bg-white mb-1.5"></span>
                <span className="block h-0.5 bg-white mb-1.5"></span>
                <span className="block h-0.5 bg-white"></span>
              </span>
            </button>
          )}
        </div>
      </div>

      {!hideLinks && menuOpen && (
        <div className="lg:hidden border-t border-slate-700 bg-slate-900">
          <div className="px-4 py-3 grid gap-2 text-white font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 hover:bg-slate-800 transition"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <p className="px-3 py-2 text-xs text-slate-400 truncate">
                Welcome {userName} - ID: {userId}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && <SignupLoginModal onClose={() => setShowModal(false)} />}
    </nav>
  );
}
