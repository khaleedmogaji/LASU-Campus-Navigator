import React from "react";
import { cn } from "../../lib/utils";

const ACCENT_MAP = {
  primary: {
    icon: "bg-lasu-primary/10 text-lasu-primary",
    bar: "bg-lasu-primary",
  },
  green: { icon: "bg-lasu-green/10 text-lasu-green", bar: "bg-lasu-green" },
  gold: { icon: "bg-lasu-gold/10 text-lasu-gold", bar: "bg-lasu-gold" },
} as const;

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: keyof typeof ACCENT_MAP;
}

export default function StatCard({
  label,
  value,
  icon,
  accent = "primary",
}: StatCardProps) {
  const a = ACCENT_MAP[accent];
  return (
    <div className="relative bg-white border border-zinc-200 rounded-2xl p-5 overflow-hidden hover:border-zinc-300 hover:shadow-sm transition-all duration-200">
      <span className={cn("absolute top-0 left-0 right-0 h-[3px]", a.bar)} />
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
            a.icon,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-zinc-900 leading-none tracking-tight">
            {value}
          </p>
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mt-1.5">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
