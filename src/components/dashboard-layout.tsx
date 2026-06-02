"use client";
 
import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "@/src/components/sidebar";
 
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  return (
    <div className="flex h-screen min-h-0 bg-zinc-900 text-white">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
 
      <main className="flex-1 p-6 min-h-0 overflow-auto lg:ml-0">{children}</main>
    </div>
  );
}