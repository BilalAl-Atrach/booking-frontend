"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SignupLoginModal from "./components/SignupLoginModal";

function HomeContent() {
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const showLogin = searchParams.get("showLogin");
    if (showLogin === "true") {
      setShowModal(true);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fadeInUp">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              Smart Booking Made{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                Simple
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Experience effortless appointment scheduling with our AI-powered
              booking system. Intuitive, fast, and reliable.
            </p>
          </div>

          {/* Right Illustration */}
          <div className="relative perspective">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 border border-slate-700/50 shadow-2xl transform hover:rotate-y-6 hover:scale-105 transition-transform duration-700">
              <div className="h-64 flex items-center justify-center text-4xl font-bold text-cyan-400">
                🚀 Booking 
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-700/50">
        <h3 className="text-4xl font-bold mb-16 text-center animate-fadeIn">
          Why Choose BookAI?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "⚡",
              title: "Lightning Fast",
              desc: "Book appointments in seconds with our optimized interface",
            },
            {
              icon: "🤖",
              title: "AI-Powered",
              desc: "Smart scheduling suggestions based on your preferences",
            },
            {
              icon: "🔒",
              title: "Secure & Reliable",
              desc: "Your data is protected with enterprise-grade security",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-8 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 hover:bg-slate-800 hover:shadow-2xl transform hover:-translate-y-2 hover:rotate-1"
            >
              <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-12 text-center backdrop-blur-sm transform hover:scale-105 transition-transform duration-700 animate-fadeInUp">
          <h3 className="text-3xl font-bold mb-4">
            Ready to simplify your bookings?
          </h3>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of satisfied users today
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && <SignupLoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
