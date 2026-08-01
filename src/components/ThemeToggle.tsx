"use client";

import { useThemeStore } from "@/store/useThemeStore";

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
