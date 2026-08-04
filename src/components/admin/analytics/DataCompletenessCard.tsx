import { AlertCircle, CheckCircle2 } from "lucide-react";
import { POI } from "../../../types";
import { cn } from "../../../lib/utils";

interface DataCompletenessCardProps {
  pois: POI[];
}

function completenessColor(pct: number) {
  if (pct >= 90) return "text-lasu-green";
  if (pct >= 60) return "text-lasu-gold";
  return "text-rose-600";
}

export function DataCompletenessCard({ pois }: DataCompletenessCardProps) {
  const total = pois.length || 1;

  const checks = [
    {
      label: "Has description",
      count: pois.filter((p) => p.description?.trim()).length,
    },
    {
      label: "Has image",
      count: pois.filter((p) => (p as any).imageUrl?.trim()).length,
    },
    {
      label: "Has nearby landmarks",
      count: pois.filter((p) => (p as any).nearbyLandmarks?.length > 0).length,
    },
    {
      label: "Has search aliases",
      count: pois.filter((p) => (p as any).searchAliases?.length > 0).length,
    },
  ];

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/5 p-5">
      <h2 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-lasu-gold" />
        Data Completeness
      </h2>
      <div className="space-y-3.5">
        {checks.map((c) => {
          const pct = Math.round((c.count / total) * 100);
          const color = completenessColor(pct);
          return (
            <div key={c.label} className="flex items-center gap-3">
              {pct >= 90 ? (
                <CheckCircle2 className={cn("w-4 h-4 shrink-0", color)} />
              ) : (
                <AlertCircle className={cn("w-4 h-4 shrink-0", color)} />
              )}
              <span className="text-xs font-bold text-zinc-700 flex-1">
                {c.label}
              </span>
              <span className={cn("text-xs font-black", color)}>{pct}%</span>
              <span className="text-[10px] font-bold text-zinc-400 w-16 text-right">
                {c.count}/{pois.length}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
