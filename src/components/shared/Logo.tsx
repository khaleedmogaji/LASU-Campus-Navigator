import React from "react";
import { cn } from "@/src/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "stacked" | "inline";
  showBar?: boolean;
  onClick?: () => void;
  className?: string;
}

const SIZE_MAP = {
  sm: { img: "w-8 h-8", title: "text-[13px]", subtitle: "text-[8px]" },
  md: {
    img: "w-9 h-9 md:w-10 md:h-10",
    title: "text-sm md:text-base",
    subtitle: "text-[9px]",
  },
  lg: { img: "w-10 h-10", title: "text-[16px]", subtitle: "text-[9px]" },
} as const;

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  variant = "stacked",
  showBar = false,
  onClick,
  className,
}) => {
  const { img, title, subtitle } = SIZE_MAP[size];

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 min-w-0",
        onClick && "cursor-pointer select-none group",
        className,
      )}
    >
      {showBar && (
        <div className="w-1.5 h-10 rounded-full bg-lasu-primary shrink-0" />
      )}

      <img
        src="lasu-logo.png"
        alt="LASU Logo"
        className={cn(
          img,
          "object-contain shrink-0 drop-shadow-sm transition-all duration-300",
          onClick && "group-hover:scale-105",
        )}
        referrerPolicy="no-referrer"
      />

      {variant === "stacked" ? (
        <div className="shrink-0">
          <h1
            className={cn(
              "font-black leading-tight tracking-tight text-zinc-900 transition-colors duration-300",
              onClick && "group-hover:text-lasu-primary",
              title,
            )}
          >
            LASU Navigator
          </h1>
          <p
            className={cn(
              "text-lasu-primary font-black uppercase tracking-[0.18em] leading-none",
              subtitle,
            )}
          >
            Campus Guide
          </p>
        </div>
      ) : (
        <span
          className={cn(
            "font-black tracking-tight text-lasu-primary leading-none",
            title,
          )}
        >
          LASU Campus Navigator
        </span>
      )}
    </div>
  );
};
