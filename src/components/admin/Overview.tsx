import { useNavigate } from "react-router-dom";
import { Building2, Layers, GraduationCap, Clock } from "lucide-react";
import { usePoiData } from "../../hooks/usePoiData";
import { CATEGORIES, CATEGORY_ICONS } from "../../lib/categoryConfig";
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
      <div>
        <h1 className="text-xl font-black text-zinc-900">Overview</h1>
        <p className="text-[11px] font-bold text-lasu-green uppercase tracking-wider flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-lasu-green animate-pulse" />
          Live Session
        </p>
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
          <h2 className="text-xs font-black text-zinc-900 uppercase tracking-wider mb-4">
            By Category
          </h2>
          <div className="space-y-3">
            {categoryCounts.map((c) => {
              const Icon = CATEGORY_ICONS[c.name];
              const pct = pois.length
                ? Math.round((c.count / pois.length) * 100)
                : 0;
              return (
                <div key={c.name} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="text-xs font-bold text-zinc-700 w-32 shrink-0 truncate">
                    {c.name}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className="h-full bg-lasu-primary rounded-full"
                      style={{ width: `${pct}%` }}
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
          <h2 className="text-xs font-black text-zinc-900 uppercase tracking-wider mb-2">
            Quick Actions
          </h2>
          <button
            onClick={() => navigate("/admin/buildings/new")}
            className="text-left px-3.5 py-3 rounded-xl bg-lasu-primary/5 hover:bg-lasu-primary/10 text-lasu-primary text-xs font-black transition-colors cursor-pointer"
          >
            + Add Building
          </button>
          <button
            onClick={() => navigate("/admin/buildings")}
            className="text-left px-3.5 py-3 rounded-xl hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
          >
            View all Buildings →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-black/5 p-5">
        <h2 className="text-xs font-black text-zinc-900 uppercase tracking-wider mb-3">
          Recently Updated
        </h2>
        {recentPois.length === 0 ? (
          <p className="text-xs text-zinc-500 font-semibold">
            No buildings yet.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentPois.map((poi) => {
              const Icon =
                CATEGORY_ICONS[poi.category as keyof typeof CATEGORY_ICONS] ??
                Building2;
              return (
                <button
                  key={poi.id}
                  onClick={() => navigate(`/admin/buildings/${poi.id}/edit`)}
                  className="w-full flex items-center gap-3 py-2.5 text-left hover:bg-zinc-50 rounded-xl px-2 -mx-2 transition-colors cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="text-xs font-bold text-zinc-800 truncate flex-1">
                    {poi.name}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">
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
