"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/hooks";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={`h-9 w-9 rounded-xl bg-gray-100 dark:bg-dark-700 ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 ${
        theme === "dark"
          ? "bg-dark-700 text-amber-400 hover:bg-dark-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${className}`}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
