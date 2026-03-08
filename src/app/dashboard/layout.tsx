import React from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  PlusCircle,
  Folder,
  CreditCard,
  Settings,
  Globe,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    {
      label: "Start New Project",
      icon: PlusCircle,
      href: "/dashboard/new-project",
    },
    { label: "My Projects", icon: Folder, href: "/dashboard/my-projects" },
    { label: "Billing", icon: CreditCard, href: "/dashboard/billing" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#FFFFFF] font-sans selection:bg-[#FF4D00] selection:text-white">
      {/* Sidebar for Desktop */}
      <aside className="w-64 border-r border-[#262626] bg-[#151515] hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-[#262626] flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF4D00] to-[#FF6A2A] rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(255,77,0,0.3)]">
            <Globe size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Customize</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, idx) => (
            <Link key={idx} href={item.href}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors text-[#B3B3B3] hover:bg-[#262626] hover:text-[#FFFFFF]">
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile Area */}
        <div className="p-4 border-t border-[#262626] flex items-center gap-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }}
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-white truncate">
              My Account
            </span>
            <span className="text-xs text-[#B3B3B3] truncate">
              Manage Profile
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-[#262626] bg-[#151515] flex items-center justify-between px-6 shrink-0">
          <span className="font-bold text-lg text-[#FF4D00]">Customize</span>
          <UserButton afterSignOutUrl="/" />
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
