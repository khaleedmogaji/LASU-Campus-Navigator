import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Book,
  Trophy,
  Building2,
  Bed,
  MapPin,
  Landmark,
} from "lucide-react";
import { POI } from "../types";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface SearchBarProps {
  pois: POI[];
  onSelect: (poi: POI) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  isHeader?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Administrative: <Landmark className="w-3.5 h-3.5" />,
  "Lecture Theatre": <Trophy className="w-3.5 h-3.5 text-indigo-500" />,
  Library: <Book className="w-3.5 h-3.5 text-violet-500" />,
  Sports: <Trophy className="w-3.5 h-3.5 text-emerald-500" />,
  Building: <Building2 className="w-3.5 h-3.5 text-blue-500" />,
  Hostel: <Bed className="w-3.5 h-3.5 text-rose-500" />,
  Other: <MapPin className="w-3.5 h-3.5 text-slate-500" />,
};

const POPULAR_RECOMMENDATIONS = [
  "Babatunde Raji Fashola Senate Building",
  "Buba Marwa Auditorium",
  "Fatiu Ademola Akesode Library",
  "Zenith Bank ICT/CBT Centre",
  "Engineering Laboratory Complex (Ojo)",
];

const CATEGORIES = [
  "All",
  "Library",
  "Lecture Theatre",
  "Administrative",
  "Sports",
  "Building",
  "Hostel",
  "Other",
];

export const SearchBar: React.FC<SearchBarProps> = ({
  pois,
  onSelect,
  filterCategory,
  setFilterCategory,
  isHeader = false,
  searchQuery,
  setSearchQuery,
  isOpen: propsIsOpen,
  onOpenChange,
}) => {
  const query = searchQuery;
  const setQuery = setSearchQuery;
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = propsIsOpen !== undefined ? propsIsOpen : isOpenInternal;
  const setIsOpen = (val: boolean) => {
    setIsOpenInternal(val);
    onOpenChange?.(val);
  };
  const [history, setHistory] = useState<POI[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query, isOpen]);

  useEffect(() => {
    const saved = localStorage.getItem("lasu_navigator_search_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing search history:", e);
      }
    }
  }, []);

  const saveToHistory = (poi: POI) => {
    const updated = [poi, ...history.filter((h) => h.id !== poi.id)].slice(
      0,
      4,
    );
    setHistory(updated);
    localStorage.setItem(
      "lasu_navigator_search_history",
      JSON.stringify(updated),
    );
  };

  const removeFromHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem(
      "lasu_navigator_search_history",
      JSON.stringify(updated),
    );
  };

  const handleSelectPoi = (poi: POI) => {
    saveToHistory(poi);
    onSelect(poi);
    setQuery("");
    setIsOpen(false);
  };

  const filteredPois = useMemo(() => {
    return pois
      .filter((poi) => {
        const matchesCategory =
          filterCategory === "All" || poi.category === filterCategory;
        if (query) {
          const q = query.toLowerCase().trim();
          return (
            matchesCategory &&
            (poi.name.toLowerCase().includes(q) ||
              poi.category.toLowerCase().includes(q) ||
              (poi.description && poi.description.toLowerCase().includes(q)) ||
              poi.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
              poi.searchAliases?.some((alias) =>
                alias.toLowerCase().includes(q),
              ))
          );
        } else {
          return filterCategory !== "All" && matchesCategory;
        }
      })
      .slice(0, 8);
  }, [pois, query, filterCategory]);

  const groupedResults: Record<string, POI[]> = {};
  filteredPois.forEach((poi) => {
    if (!groupedResults[poi.category]) {
      groupedResults[poi.category] = [];
    }
    groupedResults[poi.category].push(poi);
  });

  const popularPois = POPULAR_RECOMMENDATIONS.map((name) =>
    pois.find((p) => p.name === name),
  ).filter((p): p is POI => !!p);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    const results =
      query || filterCategory !== "All"
        ? filteredPois
        : [...history, ...popularPois];
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelectPoi(results[activeIndex]);
      } else if (results.length > 0) {
        handleSelectPoi(results[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      e.currentTarget.blur();
    }
  };

  const renderCategoryTags = () => (
    <>
      {CATEGORIES.map((tag) => {
        const isActive = filterCategory === tag;
        return (
          <button
            key={tag}
            onClick={() => {
              setFilterCategory(isActive ? "All" : tag);
              setIsOpen(true);
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer whitespace-nowrap active:scale-95",
              isActive
                ? "bg-lasu-primary text-white border-lasu-primary"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900",
            )}
          >
            {tag === "All" ? "All categories" : tag}
          </button>
        );
      })}
    </>
  );

  return (
    <div className="relative w-full max-w-md flex flex-col gap-2.5">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-zinc-200 text-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-lasu-primary/15 focus:border-lasu-primary transition-all text-xs font-medium"
          placeholder="Search buildings, lecture theatres..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search for points of interest"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 p-1 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        )}
      </div>

      {!isHeader && (
        <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none shrink-0 max-w-full">
          {renderCategoryTags()}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[990]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-2xl shadow-lg overflow-hidden z-[1000] flex flex-col max-h-[380px] overflow-y-auto p-2 gap-2.5 scrollbar-hide",
              isHeader && "w-[320px] md:w-[380px]",
            )}
          >
            {isHeader && (
              <div className="flex gap-2 overflow-x-auto py-1 px-1 scrollbar-none shrink-0 max-w-full border-b border-zinc-100 pb-2.5">
                {renderCategoryTags()}
              </div>
            )}

            {query || filterCategory !== "All" ? (
              Object.keys(groupedResults).length > 0 ? (
                Object.keys(groupedResults).map((category) => (
                  <div key={category} className="flex flex-col gap-1">
                    <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 flex items-center gap-2 border-b border-zinc-100 pb-1.5">
                      {CATEGORY_ICONS[category] || (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                      {category}
                    </div>
                    {groupedResults[category].map((poi) => {
                      const globalIdx = filteredPois.findIndex(
                        (p) => p.id === poi.id,
                      );
                      const isHighlighted = globalIdx === activeIndex;
                      return (
                        <button
                          key={poi.id}
                          onClick={() => handleSelectPoi(poi)}
                          className={cn(
                            "w-full px-3 py-2.5 text-left rounded-xl flex flex-col transition-all cursor-pointer",
                            isHighlighted
                              ? "bg-lasu-primary text-white"
                              : "hover:bg-zinc-50",
                          )}
                        >
                          <span
                            className={cn(
                              "font-semibold text-xs",
                              isHighlighted ? "text-white" : "text-zinc-800",
                            )}
                          >
                            {poi.name}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-medium mt-0.5 transition-colors line-clamp-1",
                              isHighlighted ? "text-white/80" : "text-zinc-500",
                            )}
                          >
                            {poi.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-400 text-xs font-medium">
                  No campus matches found.
                </div>
              )
            ) : (
              <div className="flex flex-col gap-4 p-2">
                {history.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="px-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 flex items-center gap-2 mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      Recent Searches
                    </div>
                    {history.map((poi, index) => {
                      const isHighlighted = index === activeIndex;
                      return (
                        <div
                          key={poi.id}
                          onClick={() => handleSelectPoi(poi)}
                          className={cn(
                            "w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer group",
                            isHighlighted ? "bg-zinc-100" : "hover:bg-zinc-50",
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Clock className="w-3.5 h-3.5 text-zinc-300 group-hover:text-lasu-primary shrink-0 transition-colors" />
                            <span className="font-semibold text-xs text-zinc-800 truncate">
                              {poi.name}
                            </span>
                          </div>
                          <button
                            onClick={(e) => removeFromHistory(e, poi.id)}
                            className="p-1 hover:bg-zinc-200/70 rounded-full text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Remove search"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <div className="px-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-lasu-primary" />
                    Popular on Campus
                  </div>
                  {popularPois.map((poi, index) => {
                    const isHighlighted =
                      history.length + index === activeIndex;
                    return (
                      <button
                        key={poi.id}
                        onClick={() => handleSelectPoi(poi)}
                        className={cn(
                          "w-full px-3 py-2.5 text-left rounded-xl flex items-center gap-2.5 transition-all cursor-pointer group",
                          isHighlighted ? "bg-zinc-100" : "hover:bg-zinc-50",
                        )}
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-zinc-300 group-hover:text-lasu-primary shrink-0 transition-colors" />
                        <span className="font-semibold text-xs text-zinc-800 truncate">
                          {poi.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
