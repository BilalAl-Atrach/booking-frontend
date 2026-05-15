"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

type Slot = {
  id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
};

export default function BookingPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");

    if (token) {
      setIsAuthenticated(true);
      setUserName(name || "");
    } else {
      setIsAuthenticated(false);
    }

    fetchSlots();
  }, []);

  async function fetchSlots() {
    try {
      const res = await api.get("/slots/available");
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleBook(slot: Slot) {
    // Clear previous errors
    setBookingError(null);

    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (!token) {
      setBookingError("You must login to reserve a slot");
      // Redirect to home/login page after 2 seconds
      setTimeout(() => {
        router.push("/?showLogin=true");
      }, 1500);
      return;
    }

    try {
      const res = await api.post(
        "/book",
        { slot_id: slot.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = res.data;
      console.log("Booking response:", data);

      // Update state so button changes immediately
      setSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, is_booked: true } : s)),
      );

      // Redirect to confirmation
      router.push(
        `/confirmation?slot=${slot.id}&start=${slot.start_time}&end=${slot.end_time}`,
      );
    } catch (err) {
      console.error("Booking failed:", err);
      if ((err as any).response?.status === 401) {
        setBookingError("Session expired. Please login again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        setTimeout(() => {
          router.push("/?showLogin=true");
        }, 2000);
        return;
      }

      setBookingError(
        (err as any).response?.data?.detail ||
          (err as Error).message ||
          "Booking failed. Please try again.",
      );
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Login Required
          </h2>
          <p className="text-slate-600 mb-6">
            You must be logged in to reserve a booking slot.
          </p>
          <button
            onClick={() => router.push("/?showLogin=true")}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-md active:scale-95"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Book Your Slot
                </h1>
                <p className="text-sm text-slate-600">
                  Choose an available time that works for you
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Error Message */}
        {bookingError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700">{bookingError}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 text-lg">Loading available slots...</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No Slots Available
            </h3>
            <p className="text-slate-600 text-center">
              Check back later for available booking times
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <p className="text-slate-700 font-medium">
                Found{" "}
                <span className="text-blue-600 font-bold">{slots.length}</span>{" "}
                available slots
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slots.map((slot) => {
                const startDate = new Date(slot.start_time);
                const endDate = new Date(slot.end_time);
                const formattedDate = startDate.toLocaleDateString("en-US", {
                  month: "short",
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
                  <div
                    key={slot.id}
                    className={`rounded-lg border-2 transition-all duration-300 ${
                      slot.is_booked
                        ? "bg-slate-50 border-slate-200 opacity-60"
                        : "bg-white border-blue-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                    }`}
                  >
                    <div className="p-6">
                      {/* Date Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            slot.is_booked ? "bg-slate-100" : "bg-blue-100"
                          }`}
                        >
                          <svg
                            className={`w-5 h-5 ${slot.is_booked ? "text-slate-400" : "text-blue-600"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            slot.is_booked ? "text-slate-500" : "text-blue-600"
                          }`}
                        >
                          {formattedDate}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="mb-6">
                        <p
                          className={`text-2xl font-bold mb-1 ${
                            slot.is_booked ? "text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {formattedStart}
                        </p>
                        <p
                          className={`text-sm ${
                            slot.is_booked ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          to {formattedEnd}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="mb-6">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            slot.is_booked
                              ? "bg-slate-200 text-slate-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {slot.is_booked ? "✓ Booked" : "● Available"}
                        </span>
                      </div>

                      {/* Button */}
                      <button
                        disabled={slot.is_booked}
                        onClick={() => handleBook(slot)}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                          slot.is_booked
                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-md active:scale-95"
                        }`}
                      >
                        {slot.is_booked ? "Already Booked" : "Reserve Slot"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
