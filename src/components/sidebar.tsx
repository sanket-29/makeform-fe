"use client";

import { FileText, ChevronDown, Home, Menu, X, ChevronLeft, ChevronRight, BarChart3, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ProfileMenu from "@/src/components/profile-menu";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [openForms, setOpenForms] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [openReports, setOpenReports] = useState(true);
  return (
    <>
      {/* Hamburger Menu Button - visible on mobile */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-950 border border-white/10 text-white hover:bg-white/5 transition"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay backdrop - visible on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-64 h-screen bg-zinc-950 border-r border-white/10 flex flex-col transition-all duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${!isExpanded && "lg:w-20"}`}
      >
        <div>
          {/* Header with Permitting Title and Toggle Button */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            {isExpanded && (
              <span className="text-lg font-semibold">Permitting</span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden lg:flex p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
              aria-label="Toggle sidebar width"
            >
              {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {/* Home Button */}
            <Link href="/dashboard">
              <div
                title="Home"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition cursor-pointer ${
                  pathname === "/dashboard"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                } ${!isExpanded && "lg:justify-center"}`}
              >
                <Home size={18} />
                {isExpanded && <span className="text-sm">Home</span>}
              </div>
            </Link>

            <Link href="/overview">
              <div
                title="Overview"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition cursor-pointer ${
                  pathname === "/overview"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                } ${!isExpanded && "lg:justify-center"}`}
              >
                 <LayoutDashboard size={18} />
                
                {isExpanded && <span className="text-sm">Overview</span>}
              </div>
            </Link>


            {/* Application Forms Dropdown */}
            <div>
              <button
                title="Application Forms"
                onClick={() => setOpenForms(!openForms)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition ${
                  !isExpanded && "lg:justify-center"
                }`}
              >
                <FileText size={18} />
                {isExpanded && (
                  <>
                    <span className="text-sm flex-1">Application Forms</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openForms ? "rotate-180" : ""}`}
                    />
                  </>
                )}
              </button>

              {/* Submenu Items - only visible when expanded */}
              {isExpanded && (
                <div
                  className={`ml-6 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                    openForms ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <SubItem
                    label="Residential Building"
                    href="/forms/residential"
                    active={pathname === "/forms/residential"}
                  />
                  <SubItem
                    label="Commercial Building"
                    href="/forms/commercial"
                    active={pathname === "/forms/commercial"}
                  />
                  <SubItem 
                    label="Electrical"
                    href="/forms/electrical"
                    active={pathname === "/forms/electrical"}
                  />
                  <SubItem 
                  label = "Gas"
                  href="/forms/gas"
                  active={pathname === "/forms/gas"}
                  />
                  <SubItem
                    label="Plumbing"
                    href="/forms/plumbing"
                    active={pathname === "/forms/plumbing"}
                  />
                </div>
              )}
            </div>

            {/* Reports Dropdown */}
<div>
  <button
    title="Reports"
    onClick={() => setOpenReports(!openReports)}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition ${
      !isExpanded && "lg:justify-left"
    }`}
  >
    <BarChart3 size={18} />

    {isExpanded && (
      <>
        <span className="text-sm flex-1">Reports</span>

        <ChevronDown
          size={16}
          className={`transition-transform ${
            openReports ? "rotate-180" : ""
          }`}
        />

      </>
    )}
  </button>

  {/* Submenu */}
  {isExpanded && (
    <div
      className={`ml-6 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
        openReports ? "max-h-40" : "max-h-0"
      }`}
    >
      
      <SubItem
        label="Common Reports"
        href="/reports/common"
        active={pathname === "/reports/common"}
      />

      <SubItem
        label="Monthly Reports"
        href="/reports/monthly"
        active={pathname === "/reports/monthly"}
      />

      <SubItem
        label="Summary Reports"
        href="/reports/summary"
        active={pathname === "/reports/summary"}
      />
    </div>
  )}
</div>

          </nav>
        </div>

        {/* Profile Menu at Bottom */}
        <div className="mt-auto p-4 border-t border-white/10">
          <ProfileMenu isExpanded={isExpanded} />
        </div>
      </aside>
    </>
  );
}

function SubItem({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block text-sm px-3 py-1 rounded-md transition ${
        active
          ? "border-l-2 border-white-500 bg-white/5 text-white"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`} 
      
      >
        {label}
    </Link>
  );
}
