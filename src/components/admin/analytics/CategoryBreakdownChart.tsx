import { POI } from "../../../types";
import {
  CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  resolveCategoryColor,
  categoryTint,
} from "../../../lib/categoryConfig";

interface CategoryBreakdownChartProps {
  pois: POI[];
}

export function CategoryBreakdownChart({ pois }: CategoryBreakdownChartProps) {
  const counts = CATEGORIES.map((cat) => ({
    name: cat,
    count: pois.filter((p) => p.category === cat).length,
  })).sort((a, b) => b.count - a.count);

  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/5 p-5">
      <h2 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-lasu-primary" />
        Category Breakdown
      </h2>
      <div className="space-y-4">
        {counts.map((c) => {
          const Icon = CATEGORY_ICONS[c.name];
          const rawColor = CATEGORY_COLORS[c.name];
          const color = resolveCategoryColor(rawColor);
          const pct = Math.round((c.count / max) * 100);
          return (
            <div key={c.name} className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: categoryTint(rawColor) }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </span>
              <span className="text-xs font-bold text-zinc-700 w-32 shrink-0 truncate">
                {c.name}
              </span>
              <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: rawColor }}
                />
              </div>
              <span className="text-[11px] font-black text-zinc-500 w-8 text-right shrink-0">
                {c.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
