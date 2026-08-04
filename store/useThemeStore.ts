import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  hasHydrated: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setHasHydrated: (value: boolean) => void;
}

const applyThemeClass = (theme: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      hasHydrated: false,

      setTheme: (theme) => {
        applyThemeClass(theme);
        set({ theme });
      },

      toggleTheme: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark";
        applyThemeClass(next);
        set({ theme: next });
      },

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        applyThemeClass(state.theme);
        state.setHasHydrated(true);
      },
    },
  ),
);
