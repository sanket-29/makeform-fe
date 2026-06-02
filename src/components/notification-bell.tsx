"use client";

import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-white/5 transition"
      >
        <Bell size={20} />

        {/* Red dot */}
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-white/10 rounded-xl shadow-lg p-3">

          <p className="text-sm text-gray-400 mb-2">
            Notifications
          </p>

          <div className="space-y-2 text-sm">
            <div className="p-2 hover:bg-white/5 rounded">
              New application submitted
            </div>

            <div className="p-2 hover:bg-white/5 rounded">
              Payment completed
            </div>

            <div className="p-2 hover:bg-white/5 rounded">
              Permit approved
            </div>
          </div>

        </div>
      )}

    </div>
  );
}