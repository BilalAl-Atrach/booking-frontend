"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [booked, setBooked] = useState<any[]>([]);
  const [available, setAvailable] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState<any>(null);
  const [newSlot, setNewSlot] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole");

      if (!token || role !== "admin") {
        router.replace("/");
        return;
      }

      const authHeaders = { Authorization: `Bearer ${token}` };
      await api.get("/admin/dashboard", {
        headers: authHeaders,
      });

      const [bookedRes, availableRes, waitlistRes] = await Promise.all([
        api.get("/slots/booked"),
        api.get("/slots/available"),
        api.get("/admin/waitlist", { headers: authHeaders }),
      ]);

      setBooked(bookedRes.data);
      setAvailable(availableRes.data);
      setWaitlist(waitlistRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
      if ((err as any).response?.status === 401) {
        router.replace("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSlot = async () => {
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await api.post(
        "/admin/slots",
        {
          date: newSlot.date,
          start_time: newSlot.startTime,
          end_time: newSlot.endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status >= 200 && response.status < 300) {
        setNewSlot({ date: "", startTime: "", endTime: "" });
        setShowAddSlot(false);
        loadData();
        alert("Slot added successfully!");
      }
    } catch (err) {
      console.error("Error adding slot:", err);
      alert("Failed to add slot");
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await api.delete(`/admin/slots/${slotId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status >= 200 && response.status < 300) {
        loadData();
        alert("Slot deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting slot:", err);
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage bookings, slots, and waitlist</p>
        </div>

        {/* Booked Slots Table */}
        <div className="mb-6 sm:mb-8 bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-green-400">
            📅 Booked Slots ({booked.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-600">
                <tr className="text-slate-300">
                  <th className="text-left py-3 px-4">Slot ID</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Time</th>
                  <th className="text-left py-3 px-4">End Time</th>
                  <th className="text-left py-3 px-4">Customer Name</th>
                  <th className="text-left py-3 px-4">Customer ID</th>
                </tr>
              </thead>
              <tbody>
                {booked.length > 0 ? (
                  booked.map((slot: any) => {
                    const { date, time } = formatDateTime(slot.start_time);
                    const endTime = new Date(slot.end_time).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );
                    return (
                      <tr
                        key={slot.id}
                        className="border-b border-slate-700 hover:bg-slate-700"
                      >
                        <td className="py-3 px-4 font-mono text-blue-400">
                          #{slot.id}
                        </td>
                        <td className="py-3 px-4">{date}</td>
                        <td className="py-3 px-4">{time}</td>
                        <td className="py-3 px-4">{endTime}</td>
                        <td className="py-3 px-4 font-semibold">
                          {slot.customer_name || "Unknown"}
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-400">
                          #{slot.customer_id || "N/A"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-slate-400">
                      No booked slots
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Slots Table */}
        <div className="mb-6 sm:mb-8 bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-400">
              ⏰ Available Slots ({available.length})
            </h2>
            <button
              onClick={() => setShowAddSlot(!showAddSlot)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition w-full sm:w-auto"
            >
              {showAddSlot ? "Cancel" : "+ Add Slot"}
            </button>
          </div>

          {showAddSlot && (
            <div className="bg-slate-700 p-4 rounded mb-4 border border-blue-500">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, date: e.target.value })
                  }
                  className="bg-slate-600 text-white px-3 py-2 rounded"
                />
                <input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startTime: e.target.value })
                  }
                  className="bg-slate-600 text-white px-3 py-2 rounded"
                />
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endTime: e.target.value })
                  }
                  className="bg-slate-600 text-white px-3 py-2 rounded"
                />
              </div>
              <button
                onClick={handleAddSlot}
                className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold transition w-full"
              >
                Create Slot
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-600">
                <tr className="text-slate-300">
                  <th className="text-left py-3 px-4">Slot ID</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Start Time</th>
                  <th className="text-left py-3 px-4">End Time</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {available.length > 0 ? (
                  available.map((slot) => {
                    const { date, time } = formatDateTime(slot.start_time);
                    const endTime = new Date(slot.end_time).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );
                    return (
                      <tr
                        key={slot.id}
                        className="border-b border-slate-700 hover:bg-slate-700"
                      >
                        <td className="py-3 px-4 font-mono text-cyan-400">
                          #{slot.id}
                        </td>
                        <td className="py-3 px-4">{date}</td>
                        <td className="py-3 px-4">{time}</td>
                        <td className="py-3 px-4">{endTime}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-400">
                      No available slots
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Waitlist Table */}
        <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-yellow-400">
            ⏳ Waitlist ({waitlist.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-600">
                <tr className="text-slate-300">
                  <th className="text-left py-3 px-4">User ID</th>
                  <th className="text-left py-3 px-4">Preferred Date</th>
                  <th className="text-left py-3 px-4">Reason</th>
                  <th className="text-left py-3 px-4">Added Date</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.length > 0 ? (
                  waitlist.map((w) => (
                    <tr
                      key={w.id}
                      className="border-b border-slate-700 hover:bg-slate-700"
                    >
                      <td className="py-3 px-4 font-mono text-orange-400">
                        #{w.user_id}
                      </td>
                      <td className="py-3 px-4">
                        {w.preferred_date || "Not specified"}
                      </td>
                      <td className="py-3 px-4">
                        {w.reason || "No reason provided"}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(w.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400">
                      No one on waitlist
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
