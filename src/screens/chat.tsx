"use client";

import { useEffect, useState } from "react";
import { Printer, X } from "lucide-react";

type Message = {
  _id: string;
  sender: "staff" | "user";
  message: string;
  createdAt: string;
};

export default function Chat({
  applicationId,
  role = "user",
}: {
  applicationId: string;
  role?: "user" | "staff";
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // ✅ FETCH MESSAGES
  useEffect(() => {
    if (!applicationId) return;

    const fetchMessages = async () => {
      const res = await fetch(
        `http://localhost:5000/api/chat/${applicationId}`
      );
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
  }, [applicationId]);

  // ✅ SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await fetch("http://localhost:5000/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicationId,
        sender: role,
        message: input,
      }),
    });

    const newMsg = await res.json();

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl flex flex-col h-[500px]">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        <span className="text-gray-300">Application Chat</span>

        <div className="flex items-center gap-4">
          {/* Print */}
          <button className="text-blue-400 flex items-center gap-1">
            <Printer size={16} />
            Print
          </button>

          {/* ❌ Close button ONLY for user */}
          {role === "user" && (
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("closeChat"));
                }
              }}
              className="text-red-400 hover:text-red-300 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.sender === role ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-3 py-2 rounded-lg text-sm ${msg.sender === role
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-gray-200"
                }`}
            >
              {msg.message}
              <div className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-white/10">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-zinc-800 p-2 rounded"
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-6 py-2 rounded-lg text-base font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}