import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        "background-subtle": "var(--color-background-subtle)",

        foreground: "var(--color-foreground)",
        "foreground-muted": "var(--color-foreground-muted)",

        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-foreground": "var(--color-primary-foreground)",

        secondary: "var(--color-secondary)",
        "secondary-hover": "var(--color-secondary-hover)",
        "secondary-foreground": "var(--color-secondary-foreground)",

        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "accent-foreground": "var(--color-accent-foreground)",

        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",

        card: "var(--color-card)",
        "card-raised": "var(--color-card-raised)",
        "card-foreground": "var(--color-card-foreground)",

        success: "var(--color-success)",
        "success-foreground": "var(--color-success-foreground)",
        warning: "var(--color-warning)",
        "warning-foreground": "var(--color-warning-foreground)",
        destructive: "var(--color-destructive)",
        "destructive-foreground": "var(--color-destructive-foreground)",

        border: "var(--color-border)",
        "border-subtle": "var(--color-border-subtle)",

        input: "var(--color-input)",
        "input-focus": "var(--color-input-focus)",

        ring: "var(--color-ring)",

        highlight: "var(--color-highlight)",
        "highlight-foreground": "var(--color-highlight-foreground)",

        // Legacy LASU aliases — match the ones aliased in index.css
        "lasu-primary": "var(--color-lasu-primary)",
        "lasu-secondary": "var(--color-lasu-secondary)",
        "lasu-accent": "var(--color-lasu-accent)",
        "lasu-green": "var(--color-lasu-green)",
        "lasu-gold": "var(--color-lasu-gold)",
      },

      borderColor: {
        DEFAULT: "var(--color-border)",
      },

      ringColor: {
        DEFAULT: "var(--color-ring)",
      },

      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};

export default config;
