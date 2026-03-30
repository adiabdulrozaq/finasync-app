"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PieChart,
  Target,
  Settings,
  RefreshCw,
  PiggyBank,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const primaryNav = [
  { name: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analitik", href: "/dashboard/analytics", icon: PieChart },
  { name: "Anggaran", href: "/dashboard/budget", icon: Target },
];

const moreNav = [
  { name: "Berulang", href: "/dashboard/recurring", icon: RefreshCw },
  { name: "Tabungan", href: "/dashboard/savings", icon: PiggyBank },
  { name: "Kategori", href: "/dashboard/categories", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const isMoreActive = moreNav.some((item) => pathname === item.href);

  return (
    <>
      {/* More menu overlay */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setShowMore(false)}
          />
        )}
      </AnimatePresence>

      {/* More menu sheet */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-16 left-0 right-0 z-50 rounded-t-3xl bg-[var(--card)] border-t border-[var(--border)] shadow-2xl p-4 md:hidden"
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-bold text-sm text-[var(--foreground)]">Menu Lainnya</h3>
              <button
                onClick={() => setShowMore(false)}
                className="p-1 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {moreNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setShowMore(false)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 rounded-2xl p-4 transition-all",
                      isActive
                        ? "bg-primary-50 text-primary-600"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 z-50 w-full border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-lg md:hidden pb-safe">
        <div className="flex h-16 justify-between px-2">
          {primaryNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full min-w-[60px] transition-colors",
                  isActive ? "text-primary-600" : "text-[var(--muted-foreground)]"
                )}
              >
                {isActive && (
                  <div className="absolute top-0 h-0.5 w-8 rounded-full bg-primary-500" />
                )}
                <item.icon className={cn("h-5 w-5 mb-0.5", isActive && "text-primary-600")} />
                <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "relative flex flex-col items-center justify-center w-full min-w-[60px] transition-colors",
              isMoreActive || showMore ? "text-primary-600" : "text-[var(--muted-foreground)]"
            )}
          >
            {(isMoreActive || showMore) && (
              <div className="absolute top-0 h-0.5 w-8 rounded-full bg-primary-500" />
            )}
            <MoreHorizontal className="h-5 w-5 mb-0.5" />
            <span className={cn("text-[10px] font-medium", (isMoreActive || showMore) && "font-bold")}>
              Lainnya
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
