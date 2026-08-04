import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { usePoiData } from "../../hooks/usePoiData";
import {
  CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  resolveCategoryColor,
  categoryTint,
  Category,
} from "../../lib/categoryConfig";
import { DeleteConfirmModal } from "../../components/admin/DeleteConfirmModal";
import { POI } from "../../types";
import { cn } from "../../lib/utils";

export default function AdminDashboardBuildings() {
  const { pois, loading, deletePoi } = usePoiData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [pendingDelete, setPendingDelete] = useState<POI | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    return pois.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [pois, search, activeCategory]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deletePoi(pendingDelete.id);
      setPendingDelete(null);
    } catch (err) {
      console.error("Failed to delete building:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1 h-9 rounded-full bg-lasu-primary shrink-0" />
          <div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
              Buildings
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
              {loading ? "Loading…" : `${pois.length} landmarks`}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/buildings/new")}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-lasu-primary hover:bg-lasu-primary-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Building
        </button>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-black/5 p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search buildings…"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-zinc-700 placeholder-zinc-400 focus:outline-none focus:border-lasu-primary focus:ring-2 focus:ring-lasu-primary/10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveCategory("All")}
            className={cn(
              "px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0",
              activeCategory === "All"
                ? "bg-lasu-primary text-white"
                : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100",
            )}
          >
            All
          </button>
          {CATEGORIES.map((cat) => {
            const rawColor = CATEGORY_COLORS[cat];
            const color = resolveCategoryColor(rawColor);
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5",
                  isActive
                    ? "text-white shadow-sm"
                    : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100",
                )}
                style={isActive ? { backgroundColor: color } : undefined}
              >
                {!isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-black/5 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-xs font-bold text-zinc-500">
              {pois.length === 0
                ? "No buildings yet — add your first one."
                : "No buildings match your search."}
            </p>
            {pois.length === 0 && (
              <button
                onClick={() => navigate("/admin/buildings/new")}
                className="mt-3 text-xs font-black text-lasu-primary hover:underline cursor-pointer"
              >
                + Add Building
              </button>
            )}
            {pois.length > 0 && filtered.length === 0 && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-3 text-xs font-black text-lasu-primary hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filtered.map((poi) => {
              const cat = poi.category as Category;
              const Icon = CATEGORY_ICONS[cat];
              const rawColor = CATEGORY_COLORS[cat] ?? "#a1a1aa";
              const color = resolveCategoryColor(rawColor);
              return (
                <div
                  key={poi.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50 transition-colors group"
                >
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: categoryTint(rawColor) }}
                  >
                    {Icon ? (
                      <Icon className="w-4 h-4" style={{ color }} />
                    ) : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-zinc-800 truncate">
                      {poi.name}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {poi.category} · {poi.latitude.toFixed(4)},{" "}
                      {poi.longitude.toFixed(4)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() =>
                        navigate(`/admin/buildings/${poi.id}/edit`)
                      }
                      className="p-2 hover:bg-zinc-200/70 rounded-lg text-zinc-500 hover:text-lasu-primary transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPendingDelete(poi)}
                      className="p-2 hover:bg-red-50 rounded-lg text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {pendingDelete && (
        <DeleteConfirmModal
          title={`Delete "${pendingDelete.name}"?`}
          description="This removes it from the student-facing map immediately. This can't be undone."
          isDeleting={deleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
