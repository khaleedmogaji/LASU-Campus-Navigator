import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { POI } from "../../../types";
import {
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  resolveCategoryColor,
  categoryTint,
  Category,
} from "../../../lib/categoryConfig";

interface RecentActivityListProps {
  pois: POI[];
  limit?: number;
}

export function RecentActivityList({ pois, limit }: RecentActivityListProps) {
  const navigate = useNavigate();

  const sorted = [...pois].sort(
    (a: any, b: any) =>
      (b.updatedAt?.seconds ?? 0) - (a.updatedAt?.seconds ?? 0),
  );
  const visible = limit ? sorted.slice(0, limit) : sorted;

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/5 p-5">
      <h2 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-lasu-green" />
        Activity Log
      </h2>
      {visible.length === 0 ? (
        <p className="text-xs text-zinc-500 font-semibold">No activity yet.</p>
      ) : (
        <div className="divide-y divide-zinc-100 max-h-96 overflow-y-auto custom-scrollbar">
          {visible.map((poi: any) => {
            const cat = poi.category as Category;
            const Icon = CATEGORY_ICONS[cat] ?? Building2;
            const rawColor = CATEGORY_COLORS[cat] ?? "#a1a1aa";
            const color = resolveCategoryColor(rawColor);
            const date = poi.updatedAt?.seconds
              ? new Date(poi.updatedAt.seconds * 1000).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric" },
                )
              : "—";
            return (
              <button
                key={poi.id}
                onClick={() => navigate(`/admin/buildings/${poi.id}/edit`)}
                className="w-full flex items-center gap-3 py-3 text-left hover:bg-zinc-50 rounded-xl px-2 -mx-2 transition-colors cursor-pointer group"
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: categoryTint(rawColor) }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </span>
                <span className="text-xs font-bold text-zinc-800 truncate flex-1 group-hover:text-lasu-primary transition-colors">
                  {poi.name}
                </span>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wide">
                  {date}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
