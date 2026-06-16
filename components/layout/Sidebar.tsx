"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Building2, Package,
  PieChart, Link2, Settings, Box, LogOut,
} from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/lib/supabase";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Purchase orders", href: "/purchase-orders", icon: FileText, badge: 4 },
  { label: "Vendors", href: "/vendors", icon: Building2 },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Budget", href: "/budget", icon: PieChart },
];

const navSecondary = [
  { label: "Supplier portal", href: "/supplier-portal", icon: Link2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Box size={18} className="text-brand-500" />
          <span className="font-semibold text-gray-900 text-sm">ProcureHub</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 ml-6">Procurement portal</p>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        <p className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-2 mb-1">Main</p>
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={clsx("flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
                active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}>
              <item.icon size={15} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-red-100 text-red-700 rounded-full px-1.5 py-0.5 font-medium">{item.badge}</span>
              )}
            </Link>
          );
        })}

        <p className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1">External</p>
        {navSecondary.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={clsx("flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
                active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}>
              <item.icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold">
            BS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">Baseerat</p>
            <p className="text-[10px] text-gray-400">Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
