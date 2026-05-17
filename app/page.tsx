"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SignupLoginModal from "./components/SignupLoginModal";

/* ─── Interactive 3D booking card ────────────────────────────────────────── */
function BookingCard3D() {
  const [rotation, setRotation] = useState({ x: -8, y: 12 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * -18;
    const ry = ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 18;
    setRotation({ x: rx, y: ry });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setRotation({ x: -8, y: 12 }); setHovered(false); }}
      className="relative h-full w-full cursor-pointer select-none"
      style={{ perspective: "900px" }}
    >
      <div
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: hovered ? "transform 0.08s ease-out" : "transform 0.6s cubic-bezier(.23,1,.32,1)",
          transformStyle: "preserve-3d",
        }}
        className="relative w-full"
      >
        {/* Glow halo behind card */}
        <div
          className="absolute -inset-8 rounded-[2.5rem] opacity-50 blur-3xl"
          style={{ background: "radial-gradient(ellipse at 55% 40%, #06b6d455 0%, #7c3aed33 60%, transparent 100%)" }}
        />

        {/* Card body */}
        <div
          className="relative overflow-hidden rounded-3xl border border-white/10"
          style={{
            background: "linear-gradient(145deg, rgba(12,16,36,0.98) 0%, rgba(8,10,24,1) 100%)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5" style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.12), rgba(124,58,237,0.08))" }}>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">BookAI</span>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> AI Active
            </span>
          </div>

          {/* Mini calendar */}
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">June 2025</p>
              <div className="flex gap-1">
                {["◀","▶"].map((a) => (
                  <button key={a} className="flex h-5 w-5 items-center justify-center rounded text-[9px] text-slate-600 hover:text-cyan-400 transition-colors">{a}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div key={i} className="pb-1 text-[10px] font-bold text-slate-600">{d}</div>
              ))}
              {["","","","","","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"].map((d, i) => (
                <div
                  key={i}
                  className={`mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-medium transition-all
                    ${d === "14" ? "bg-gradient-to-br from-cyan-500 to-violet-600 font-black text-white shadow-lg shadow-cyan-500/40" : ""}
                    ${d === "18" || d === "22" ? "border border-cyan-500/40 text-cyan-400" : ""}
                    ${d && d !== "14" && d !== "18" && d !== "22" ? "cursor-pointer text-slate-400 hover:bg-white/5" : ""}
                    ${!d ? "opacity-0" : ""}
                  `}
                >{d}</div>
              ))}
            </div>

            {/* Time slots */}
            <div className="mt-4 space-y-2">
              {[
                { time: "09:00 AM", label: "Dr. Sarah Mitchell", status: "booked" },
                { time: "02:30 PM", label: "Team Strategy Sync",  status: "available" },
                { time: "04:00 PM", label: "Product Review",       status: "ai" },
              ].map((slot) => (
                <div
                  key={slot.time}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                  style={{
                    border: `1px solid ${slot.status === "booked" ? "rgba(6,182,212,0.2)" : slot.status === "ai" ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)"}`,
                    background: slot.status === "ai" ? "rgba(124,58,237,0.07)" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <span className="w-16 shrink-0 font-mono text-[10px] font-semibold text-slate-500">{slot.time}</span>
                  <span className="flex-1 text-[11px] font-medium text-slate-300">{slot.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide
                    ${slot.status === "booked" ? "bg-cyan-500/15 text-cyan-400" :
                      slot.status === "ai"     ? "bg-violet-500/15 text-violet-400" :
                                                  "bg-emerald-500/15 text-emerald-400"}`}>
                    {slot.status === "ai" ? "AI ✦" : slot.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Holographic shimmer */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(6,182,212,0.06) 45%, rgba(255,255,255,0.04) 50%, rgba(124,58,237,0.06) 55%, transparent 70%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Background ─────────────────────────────────────────────────────────── */
function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0L0 0 0 60" fill="none" stroke="rgba(6,182,212,1)" strokeWidth="0.5"/>
          </pattern>
          <radialGradient id="gfade" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="1"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <mask id="gmask"><rect width="100%" height="100%" fill="url(#gfade)"/></mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gmask)"/>
      </svg>
      <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full opacity-[0.18]" style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", filter: "blur(80px)", animation: "orb1 14s ease-in-out infinite" }}/>
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full opacity-[0.14]" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", filter: "blur(60px)", animation: "orb2 18s ease-in-out infinite" }}/>
      <div className="absolute right-10 top-24 h-56 w-56 rounded-full opacity-[0.09]" style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)", filter: "blur(50px)", animation: "orb3 11s ease-in-out infinite" }}/>
    </div>
  );
}

function FeatureCard({ icon, title, desc, accent }: { icon: string; title: string; desc: string; accent: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.05] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.1]" style={{ background: "rgba(255,255,255,0.018)", backdropFilter: "blur(20px)" }}>
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 25% 50%, ${accent}10 0%, transparent 65%)` }}/>
      <div className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}/>
      <div className="relative">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ background: `${accent}14`, border: `1px solid ${accent}22` }}>{icon}</div>
        <h4 className="mb-2 font-display text-base font-bold text-white">{title}</h4>
        <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-4xl font-black" style={{ background: "linear-gradient(135deg,#06b6d4,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-slate-600">{label}</p>
    </div>
  );
}

function Step({ n, label, sub, accent }: { n: string; label: string; sub: string; accent: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl font-display text-xl font-black text-white" style={{ background: `linear-gradient(135deg, ${accent}28, ${accent}0a)`, border: `1.5px solid ${accent}35`, boxShadow: `0 0 24px ${accent}18` }}>{n}</div>
      <p className="mb-1 text-sm font-bold text-white">{label}</p>
      <p className="text-xs leading-relaxed text-slate-600">{sub}</p>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
function HomeContent() {
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("showLogin") === "true") setShowModal(true);
  }, [searchParams]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Outfit:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        * { font-family: 'Outfit', sans-serif; }
        @keyframes orb1 { 0%,100%{transform:translateY(0) translateX(0) scale(1)} 33%{transform:translateY(-28px) translateX(18px) scale(1.04)} 66%{transform:translateY(14px) translateX(-12px) scale(0.97)} }
        @keyframes orb2 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-36px) translateX(28px)} }
        @keyframes orb3 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(8deg)} }
        @keyframes reveal { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardReveal { from{opacity:0;transform:rotateX(-8deg) rotateY(12deg) translateY(20px) scale(0.96)} to{opacity:1;transform:rotateX(-8deg) rotateY(12deg) translateY(0) scale(1)} }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes badgePulse { 0%,100%{box-shadow:0 0 0 0 rgba(6,182,212,0.35)} 50%{box-shadow:0 0 0 8px rgba(6,182,212,0)} }
        .r1{animation:reveal 0.85s cubic-bezier(.23,1,.32,1) 0.05s both}
        .r2{animation:reveal 0.85s cubic-bezier(.23,1,.32,1) 0.18s both}
        .r3{animation:reveal 0.85s cubic-bezier(.23,1,.32,1) 0.32s both}
        .r4{animation:reveal 0.85s cubic-bezier(.23,1,.32,1) 0.46s both}
        .rc{animation:cardReveal 1.1s cubic-bezier(.23,1,.32,1) 0.25s both}
        .f1{animation:reveal 0.8s cubic-bezier(.23,1,.32,1) 0.08s both}
        .f2{animation:reveal 0.8s cubic-bezier(.23,1,.32,1) 0.18s both}
        .f3{animation:reveal 0.8s cubic-bezier(.23,1,.32,1) 0.28s both}
        .f4{animation:reveal 0.8s cubic-bezier(.23,1,.32,1) 0.38s both}
        .f5{animation:reveal 0.8s cubic-bezier(.23,1,.32,1) 0.48s both}
        .f6{animation:reveal 0.8s cubic-bezier(.23,1,.32,1) 0.58s both}
        .ticker-inner{animation:ticker 32s linear infinite}
        .badge-pulse{animation:badgePulse 2.5s ease-in-out infinite}
        .scanlines{background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(6,182,212,0.012) 3px,rgba(6,182,212,0.012) 4px)}
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden text-white" style={{ background: "linear-gradient(155deg,#030509 0%,#060810 40%,#050710 100%)" }}>
        <div className="scanlines pointer-events-none absolute inset-0" />
        <GridBackground />

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-2 lg:gap-6 lg:pb-24 lg:pt-20">

          {/* Left */}
          <div className="relative z-10">
            <div className="r1 mb-7 inline-flex items-center gap-2.5 rounded-full border border-cyan-500/20 bg-cyan-500/7 px-4 py-2 badge-pulse">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-400">AI-Powered Scheduling</span>
            </div>

            <h1 className="r2 font-display text-[clamp(3rem,8vw,5.5rem)] font-black leading-[0.92] tracking-tight text-white">
              Book
              <br />
              <span style={{ background: "linear-gradient(90deg,#06b6d4 0%,#818cf8 55%,#c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Smarter.
              </span>
              <br />
              Live
              <br />
              Better.
            </h1>

            <p className="r3 mt-6 max-w-[26rem] text-base leading-relaxed text-slate-400 sm:text-lg">
              Let AI handle the complexity of scheduling. Instant suggestions, zero conflicts — every single time.
            </p>

            <div className="r3 mt-8 flex flex-wrap gap-3">
              <button
                className="group relative overflow-hidden rounded-xl px-7 py-3.5 font-bold text-white transition-all duration-300 hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg,#06b6d4,#7c3aed)", boxShadow: "0 0 32px rgba(6,182,212,0.28), 0 0 60px rgba(124,58,237,0.14)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start free
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
              </button>
              <button className="rounded-xl border border-white/[0.09] bg-white/[0.04] px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.07]">
                Watch demo
              </button>
            </div>

            {/* Stats */}
            <div className="r4 mt-10 flex flex-wrap gap-8 border-t border-white/[0.05] pt-8">
              <Stat value="40K+" label="Bookings made" />
              <Stat value="98%"  label="Accuracy rate" />
              <Stat value="3s"   label="Avg. booking time" />
            </div>
          </div>

          {/* Right: 3D floating card */}
          <div className="rc relative h-[490px] lg:h-[530px]" style={{ perspective: "1200px" }}>
            <div className="absolute -left-3 top-8 z-20 animate-bounce rounded-xl border border-violet-500/25 bg-violet-500/8 px-3 py-2 text-xs font-bold text-violet-300 backdrop-blur-md" style={{ animationDuration: "3.5s" }}>
              ✦ AI Suggested
            </div>
            <div className="absolute -right-2 bottom-16 z-20 rounded-xl border border-cyan-500/25 bg-cyan-500/8 px-3 py-2 text-xs font-bold text-cyan-300 backdrop-blur-md" style={{ animation: "orb3 4s ease-in-out infinite" }}>
              ⚡ Instant Confirm
            </div>
            <BookingCard3D />
          </div>
        </section>

        {/* ── TICKER ────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden border-y border-white/[0.04] py-3" style={{ background: "rgba(6,182,212,0.025)" }}>
          <div className="ticker-inner flex gap-10 whitespace-nowrap">
            {[0,1].map((k) => (
              <div key={k} className="flex shrink-0 gap-10">
                {["Smart Scheduling","AI Conflict Detection","Auto Reminders","Multi-timezone","Calendar Sync","Instant Notifications","One-click Reschedule","Team Availability"].map((l) => (
                  <span key={l} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700">
                    <span className="h-1 w-1 rounded-full bg-cyan-500/50" />{l}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ──────────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mb-4 text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan-500">Why BookAI</span>
          </div>
          <h2 className="mb-14 text-center font-display text-4xl font-black leading-tight text-white sm:text-5xl">
            Built for the way
            <br /><span className="text-slate-600">you actually work</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon:"⚡", title:"Lightning Booking",  desc:"Any appointment in under 3 seconds. No back-and-forth.", accent:"#06b6d4", cls:"f1" },
              { icon:"🤖", title:"AI Conflict Guard",   desc:"Detects overlaps before they happen, suggests the next best slot.", accent:"#818cf8", cls:"f2" },
              { icon:"🔔", title:"Smart Reminders",     desc:"Context-aware alerts at just the right time, reducing no-shows by 80%.", accent:"#c084fc", cls:"f3" },
              { icon:"🌍", title:"Timezone Magic",      desc:"Everyone sees their local time, always. Zero mental math.", accent:"#34d399", cls:"f4" },
              { icon:"📅", title:"Calendar Sync",       desc:"Google, Outlook, Apple — one source of truth, everywhere.", accent:"#fb923c", cls:"f5" },
              { icon:"🔒", title:"Enterprise Security", desc:"SOC2 compliant. End-to-end encrypted. Your data stays yours.", accent:"#f472b6", cls:"f6" },
            ].map(({ icon, title, desc, accent, cls }) => (
              <div key={title} className={cls}>
                <FeatureCard icon={icon} title={title} desc={desc} accent={accent} />
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div
            className="overflow-hidden rounded-3xl border border-white/[0.05] p-8 sm:p-14"
            style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.05) 0%, rgba(124,58,237,0.05) 100%)", backdropFilter: "blur(30px)" }}
          >
            <div className="mb-12 text-center">
              <span className="mb-3 block text-[11px] font-black uppercase tracking-[0.25em] text-violet-400">How It Works</span>
              <h2 className="font-display text-4xl font-black text-white sm:text-5xl">
                Three steps to
                <br />
                <span style={{ background: "linear-gradient(90deg,#06b6d4,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  effortless booking
                </span>
              </h2>
            </div>
            <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
              {/* Connector */}
              <div className="absolute left-[16.5%] right-[16.5%] top-7 hidden h-px sm:block" style={{ background: "linear-gradient(90deg,#06b6d4,#7c3aed)" }} />
              <Step n="01" label="Set availability"  sub="Tell us when you're free once. We handle the rest forever." accent="#06b6d4" />
              <Step n="02" label="Share your link"    sub="Send your unique BookAI link to anyone, anywhere." accent="#818cf8" />
              <Step n="03" label="AI confirms"        sub="Our AI picks the best slot and confirms both sides instantly." accent="#c084fc" />
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6">
          <div
            className="relative overflow-hidden rounded-3xl p-8 text-center sm:p-14"
            style={{
              background: "linear-gradient(140deg, rgba(6,182,212,0.1) 0%, rgba(124,58,237,0.1) 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 0 80px rgba(124,58,237,0.12), 0 0 40px rgba(6,182,212,0.08)",
            }}
          >
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25" style={{ background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)", filter: "blur(50px)" }} />
            <div className="relative">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-cyan-400">Get started today</p>
              <h2 className="mb-4 font-display text-4xl font-black text-white sm:text-5xl">
                Your calendar,
                <br />finally intelligent.
              </h2>
              <p className="mx-auto mb-8 max-w-sm text-base text-slate-500">
                Thousands of professionals have freed themselves from scheduling chaos. Your turn.
              </p>
              <button
                className="group relative overflow-hidden rounded-xl px-8 py-4 font-bold text-white transition-all duration-300 hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg,#06b6d4,#7c3aed)", boxShadow: "0 0 40px rgba(6,182,212,0.3)" }}
              >
                <span className="relative z-10">Start free — no card needed</span>
                <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10" />
              </button>
              <p className="mt-4 text-xs text-slate-700">Free forever on the starter plan · Cancel anytime</p>
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        <footer className="border-t border-white/[0.04] py-8 text-center">
          <p className="text-xs text-slate-700">© 2025 BookAI — Intelligent scheduling for modern teams</p>
        </footer>

        {showModal && <SignupLoginModal onClose={() => setShowModal(false)} />}
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}