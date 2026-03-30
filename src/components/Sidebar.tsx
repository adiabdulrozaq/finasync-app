"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  PieChart,
  Target,
  LogOut,
  Wallet,
  Settings,
  RefreshCw,
  PiggyBank,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analitik", href: "/dashboard/analytics", icon: PieChart },
  { name: "Anggaran", href: "/dashboard/budget", icon: Target },
  { name: "Berulang", href: "/dashboard/recurring", icon: RefreshCw },
  { name: "Tabungan", href: "/dashboard/savings", icon: PiggyBank },
  { name: "Kategori", href: "/dashboard/categories", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col border-r border-[var(--border)] bg-[var(--card)] md:flex sticky top-0 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-[var(--border)] px-4">
        <Link href="/" className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-blue shadow-md shadow-primary-500/20 shrink-0">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-[var(--foreground)]">
              Fina<span className="text-primary-500">Sync</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-primary-600" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary-500" />
                )}
                {/* Tooltip for collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 rounded-lg bg-[var(--foreground)] px-2.5 py-1 text-xs font-medium text-[var(--card)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto space-y-3 border-t border-[var(--border)] pt-4">
          {/* Theme toggle */}
          <div className={cn("flex items-center", collapsed ? "justify-center" : "px-2")}>
            <ThemeToggle />
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
              collapsed && "justify-center px-0"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Kecilkan</span>
              </>
            )}
          </button>

          {/* User Profile */}
          {!collapsed ? (
            <div className="rounded-xl bg-[var(--muted)] p-3">
              <div className="flex items-center gap-3">
                {session?.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-9 w-9 rounded-full ring-2 ring-[var(--border)] shrink-0"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-blue text-sm font-bold text-white shrink-0">
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex flex-col truncate min-w-0">
                  <span className="truncate text-sm font-bold text-[var(--foreground)]">
                    {session?.user?.name}
                  </span>
                  <span className="truncate text-xs text-[var(--muted-foreground)]">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Logout"
              className="flex w-full items-center justify-center rounded-xl py-2.5 text-rose-500 transition-colors hover:bg-rose-50"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
