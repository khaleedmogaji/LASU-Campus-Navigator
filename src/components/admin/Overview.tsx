import { useNavigate } from "react-router-dom";
import { Building2, Layers, GraduationCap, Clock, Plus } from "lucide-react";
import { usePoiData } from "../../hooks/usePoiData";
import {
  CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  resolveCategoryColor,
  categoryTint,
} from "../../lib/categoryConfig";
import { LASU_KNOWLEDGE_BASE } from "../../lib/lasuKnowledgeBase";
import StatCard from "./StatCard";

export default function OverviewPage() {
  const { pois, loading } = usePoiData();
  const navigate = useNavigate();

  const categoryCounts = CATEGORIES.map((cat) => ({
    name: cat,
    count: pois.filter((p) => p.category === cat).length,
  }));

  const recentPois = [...pois]
    .sort(
      (a: any, b: any) =>
        (b.updatedAt?.seconds ?? 0) - (a.updatedAt?.seconds ?? 0),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-1 h-9 rounded-full bg-lasu-gold shrink-0" />
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
            Overview
          </h1>
          <p className="text-[10px] font-bold text-lasu-green uppercase tracking-widest flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-lasu-green animate-pulse" />
            Live Session
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Landmarks"
          value={loading ? "—" : pois.length}
          icon={<Building2 className="w-5 h-5" />}
          accent="primary"
        />
        <StatCard
          label="Categories"
          value={CATEGORIES.length}
          icon={<Layers className="w-5 h-5" />}
          accent="green"
        />
        <StatCard
          label="Faculties Covered"
          value={LASU_KNOWLEDGE_BASE.length}
          icon={<GraduationCap className="w-5 h-5" />}
          accent="gold"
        />
        <StatCard
          label="Last Updated"
          value={recentPois[0] ? "Today" : "—"}
          icon={<Clock className="w-5 h-5" />}
          accent="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl ring-1 ring-black/5 p-5">
          <h2 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-lasu-primary" />
            By Category
          </h2>
          <div className="space-y-4">
            {categoryCounts.map((c) => {
              const Icon = CATEGORY_ICONS[c.name];
              const rawColor = CATEGORY_COLORS[c.name];
              const color = resolveCategoryColor(rawColor);
              const pct = pois.length
                ? Math.round((c.count / pois.length) * 100)
                : 0;
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

        <div className="bg-white rounded-2xl ring-1 ring-black/5 p-5 flex flex-col gap-2">
          <h2 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-lasu-gold" />
            Quick Actions
          </h2>
          <button
            onClick={() => navigate("/admin/buildings/new")}
            className="text-left px-3.5 py-3 rounded-xl bg-lasu-primary hover:bg-lasu-primary-dark text-white text-xs font-black uppercase tracking-wide transition-colors cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Building
          </button>
          <button
            onClick={() => navigate("/admin/buildings")}
            className="text-left px-3.5 py-3 rounded-xl hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-colors cursor-pointer border border-zinc-100"
          >
            View all Buildings →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-black/5 p-5">
        <h2 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-lasu-green" />
          Recently Updated
        </h2>
        {recentPois.length === 0 ? (
          <p className="text-xs text-zinc-500 font-semibold">
            No buildings yet.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentPois.map((poi) => {
              const cat = poi.category as keyof typeof CATEGORY_ICONS;
              const Icon = CATEGORY_ICONS[cat] ?? Building2;
              const rawColor = CATEGORY_COLORS[cat] ?? "#a1a1aa";
              const color = resolveCategoryColor(rawColor);
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
                    {poi.category}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
