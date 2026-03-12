"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PieChart, 
  Target,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analitik", href: "/dashboard/analytics", icon: PieChart },
  { name: "Anggaran", href: "/dashboard/budget", icon: Target },
  { name: "Kategori", href: "/dashboard/categories", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 z-50 w-full border-t border-gray-200 bg-white md:hidden pb-safe">
      <div className="flex h-16 justify-between px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full min-w-[64px] transition-colors",
                isActive ? "text-primary-600" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("h-6 w-6 mb-1", isActive && "fill-primary-50")} />
              <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
