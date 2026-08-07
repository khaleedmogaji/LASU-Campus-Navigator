"use client";

import { useEffect } from "react";
import { useThemeStore } from "./store/useThemeStore";

export function ThemeInitializer() {
  const hasHydrated = useThemeStore((s) => s.hasHydrated);
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    if (!hasHydrated) return;

    const stored = localStorage.getItem("theme-storage");
    const hadPersistedTheme =
      stored !== null && JSON.parse(stored)?.state?.theme !== undefined;

    if (!hadPersistedTheme) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [hasHydrated]);

  return null;
}
