import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, MapPin } from "lucide-react";
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
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1 h-9 rounded-full bg-lasu-primary shrink-0" />
          <div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
              Buildings
            </h1>
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mt-1">
              {loading ? "Loading…" : `${pois.length} landmarks`}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/buildings/new")}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-lasu-primary hover:bg-lasu-primary-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Building
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search buildings…"
            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-3 py-3 text-xs font-semibold text-zinc-700 placeholder-zinc-400 focus:outline-none focus:border-lasu-primary focus:ring-2 focus:ring-lasu-primary/10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <button
            onClick={() => setActiveCategory("All")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 border",
              activeCategory === "All"
                ? "bg-lasu-primary text-white border-lasu-primary"
                : "bg-white text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 border-zinc-200",
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
                  "px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border",
                  isActive
                    ? "text-white"
                    : "bg-white text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 border-zinc-200",
                )}
                style={
                  isActive
                    ? { backgroundColor: color, borderColor: color }
                    : undefined
                }
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

      {filtered.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center">
          <p className="text-xs font-semibold text-zinc-500">
            {pois.length === 0
              ? "No buildings yet — add your first one."
              : "No buildings match your search."}
          </p>
          {pois.length === 0 && (
            <button
              onClick={() => navigate("/admin/buildings/new")}
              className="mt-3 text-xs font-bold text-lasu-primary hover:underline cursor-pointer"
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
              className="mt-3 text-xs font-bold text-lasu-primary hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((poi) => {
            const cat = poi.category as Category;
            const Icon = CATEGORY_ICONS[cat];
            const rawColor = CATEGORY_COLORS[cat] ?? "#a1a1aa";
            const color = resolveCategoryColor(rawColor);
            return (
              <div
                key={poi.id}
                className="bg-white border border-zinc-200 rounded-2xl hover:shadow-md hover:border-zinc-300 transition-all duration-200 flex flex-col"
              >
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div className="flex items-start gap-3.5">
                    <span
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: categoryTint(rawColor) }}
                    >
                      {Icon ? (
                        <Icon className="w-5 h-5" style={{ color }} />
                      ) : null}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-sm font-bold text-zinc-900 leading-snug line-clamp-2">
                        {poi.name}
                      </p>
                      <span
                        className="inline-block text-[10px] font-semibold uppercase tracking-wide mt-2 px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: categoryTint(rawColor),
                          color,
                        }}
                      >
                        {poi.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-5 pb-5 pt-1">
                  <button
                    onClick={() => navigate(`/admin/buildings/${poi.id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-zinc-600 bg-white border border-zinc-200 hover:bg-lasu-primary/5 hover:border-lasu-primary/30 hover:text-lasu-primary hover:shadow-sm transition-all cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setPendingDelete(poi)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-zinc-600 bg-white border border-zinc-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
