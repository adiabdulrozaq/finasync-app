"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Wallet, LogOut, LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[var(--card)]/90 backdrop-blur-xl shadow-sm border-b border-[var(--border)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-blue shadow-md shadow-primary-500/20 transition-transform group-hover:scale-105">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            Fina<span className="text-primary-500">Sync</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          {status === "loading" ? (
            <div className="h-9 w-24 animate-shimmer rounded-xl" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  pathname === "/dashboard"
                    ? "bg-primary-50 text-primary-600"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="h-6 w-px bg-[var(--border)]" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[var(--muted-foreground)]">
                  {session.user?.name}
                </span>
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="h-8 w-8 rounded-full ring-2 ring-[var(--border)]"
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-blue font-bold text-white text-sm">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl gradient-blue px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <LogIn className="h-4 w-4" />
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[var(--border)] bg-[var(--card)] animate-slide-down">
          <div className="p-4 space-y-3">
            {session ? (
              <>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)]">
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="h-10 w-10 rounded-full" src={session.user.image} alt="" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-blue font-bold text-white">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-[var(--foreground)]">{session.user?.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{session.user?.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition"
                >
                  <LayoutDashboard className="h-5 w-5 text-primary-500" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-sm font-medium text-rose-500 hover:bg-rose-50 transition"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl gradient-blue p-3 text-sm font-semibold text-white shadow-md"
              >
                <LogIn className="h-4 w-4" />
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
