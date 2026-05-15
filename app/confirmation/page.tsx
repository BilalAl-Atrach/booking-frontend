"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ConfirmationContent() {
  const params = useSearchParams();
  const slotId = params.get("slot");
  const start = params.get("start");
  const end = params.get("end");

  const businessNumber = "96181020427"; // Example: Lebanon number

  const message = `Hello, I booked slot on ${new Date(start!).toLocaleString()} – ${new Date(end!).toLocaleTimeString()}.`;

  const whatsappLink = `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;

  const startDate = new Date(start!);
  const endDate = new Date(end!);
  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedStart = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedEnd = endDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-center text-emerald-600 font-semibold mb-8">
            Your slot has been reserved
          </p>

          {/* Booking Details */}
          <div className="space-y-4 bg-slate-50 rounded-xl p-6 mb-8">
            {/* Slot ID */}
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Booking ID</span>
              <span className="text-lg font-bold text-emerald-600 font-mono">
                #{slotId}
              </span>
            </div>

            {/* Date */}
            <div className="border-t border-slate-200 pt-4">
              <p className="text-slate-600 font-medium mb-2">Date</p>
              <p className="text-slate-900 font-semibold text-lg">
                {formattedDate}
              </p>
            </div>

            {/* Time */}
            <div className="border-t border-slate-200 pt-4">
              <p className="text-slate-600 font-medium mb-2">Time</p>
              <p className="text-slate-900 font-semibold text-lg">
                {formattedStart} - {formattedEnd}
              </p>
            </div>
          </div>

          {/* WhatsApp Button */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:shadow-lg active:scale-95 mb-4"
          >
            Contact on WhatsApp
          </a>

          {/* Additional Info */}
          <p className="text-center text-slate-600 text-sm">
            We'll confirm your booking shortly. Please keep this page for
            reference.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
