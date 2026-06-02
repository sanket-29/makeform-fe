"use client";

import { useState } from "react";
import {
  ChevronDown,
  User,
  Shield,
  MessageCircle,
  LogOut,
  Bell,
 
} from "lucide-react";
import DropdownItem from "./drop-down-item";

interface ProfileMenuProps {
  isExpanded?: boolean;
}

export default function ProfileMenu({ isExpanded = true }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Optional: Remove other auth-related data
    localStorage.removeItem("user");
    // Close dropdown
    setOpen(false);
    // Optional: Redirect to login page
    window.location.href = "/admin-login";
  };

  return (
    <div className="relative">

      {/* Profile Button */}
      <div
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition ${
          !isExpanded && "lg:justify-center"
        }`}
      >
        <img
          src="https://avatars.githubusercontent.com/u/24805692?v=4"
          className="w-9 h-9 rounded-full"
        />

        {isExpanded && (
          <>
            <div className="flex-1">
              <p className="text-sm font-medium">Sanket</p>
              <p className="text-xs text-gray-400">sanket@gmail.com</p>
            </div>

            <ChevronDown
              size={16}
              className={`transition ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-14 left-0 w-full bg-zinc-900/95 backdrop-blur border border-white/10 rounded-xl shadow-lg overflow-hidden">

          <DropdownItem
            label="My account"
            icon={<User size={16} />}
          />

          <DropdownItem
            label="Notifications"
            icon={<Bell size={16} />}
          />

          <DropdownItem
            label="Privacy policy"
            icon={<Shield size={16} />}
          />

          <div className="border-t border-white/10 my-1" />

          <DropdownItem
            label="Sign out"
            icon={<LogOut size={16} />}
            danger
            onClick={handleSignOut}
          />

        </div>
      )}
    </div>
  );
}