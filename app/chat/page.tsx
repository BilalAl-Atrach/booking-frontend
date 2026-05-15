"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    async function loadHistory() {
      if (!storedUserId) {
        console.log("No userId found in localStorage");
        return;
      }

      try {
        console.log("Loading history for userId:", storedUserId);
        const res = await api.get(`/conversations/${storedUserId}`);
        const data = res.data;
        console.log("History loaded:", data);

        if (data.message_history && data.message_history.length > 0) {
          const formatted = data.message_history
            .map((entry: any) => [
              { role: "user", text: entry.user_message },
              { role: "assistant", text: entry.agent_reply },
            ])
            .flat();
          setMessages(formatted);
        }
      } catch (err) {
        console.error("Error loading history:", err);
      }
    }
    loadHistory();
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    if (!userId) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Please log in to use the chatbot." },
      ]);
      setInput("");
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: input }]);

    try {
      const res = await api.post("/chat", {
        message: input,
        user_id: Number(userId),
      });
      const data = res.data;

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (err) {
      console.error("Chat failed:", err);
      if ((err as any).response?.status === 401) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Login required to continue chatting.",
          },
        ]);
        setInput("");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error: server not responding." },
      ]);
    }

    setInput("");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        AI Booking Assistant
      </h1>
      <div className="w-full max-w-lg bg-white rounded shadow p-4 mb-4 h-96 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-500 text-white text-right"
                : "bg-gray-200 text-gray-900 text-left"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!userId}
          className="flex-grow border border-black rounded-l px-3 py-2 text-black placeholder-gray-500 disabled:bg-gray-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={userId ? "Type your message..." : "Login required to chat"}
        />
        <button
          onClick={sendMessage}
          disabled={!userId}
          className={`px-4 py-2 rounded-r font-semibold ${
            userId
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
