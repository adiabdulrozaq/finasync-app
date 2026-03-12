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
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analitik", href: "/dashboard/analytics", icon: PieChart },
  { name: "Anggaran", href: "/dashboard/budget", icon: Target },
  { name: "Kategori", href: "/dashboard/categories", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-gray-200 bg-white md:flex sticky top-0">
      <div className="flex h-16 items-center border-b border-gray-100 px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary-600">
          <Wallet className="h-6 w-6" />
          <span>FinaSync</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-50 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-gray-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Segment */}
        <div className="mt-auto border-t border-gray-100 pt-6">
          <div className="mb-4 flex items-center gap-3 px-3">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-9 w-9 rounded-full ring-2 ring-primary-50"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex flex-col truncate">
              <span className="truncate text-sm font-bold text-gray-900">{session?.user?.name}</span>
              <span className="truncate text-xs text-gray-500">{session?.user?.email}</span>
            </div>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-500" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
