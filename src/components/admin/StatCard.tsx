import { cn } from "@/src/lib/utils";

export default function StatCard({
  label,
  value,
  icon,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: "primary" | "green" | "gold";
}) {
  const ACCENT_MAP = {
    primary: "bg-lasu-primary/10 text-lasu-primary",
    green: "bg-lasu-green/10 text-lasu-green",
    gold: "bg-lasu-gold/10 text-lasu-gold",
  };
  return (
    <div className="bg-white rounded-2xl p-5 ring-1 ring-black/5 flex items-center gap-4">
      <div
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
          ACCENT_MAP[accent],
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black text-zinc-900 leading-none">
          {value}
        </p>
        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}
