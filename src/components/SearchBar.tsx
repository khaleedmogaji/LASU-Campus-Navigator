import React, { useState, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Book, Trophy, Building2, Bed, MapPin, Landmark } from 'lucide-react';
import { POI } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SearchBarProps {
  pois: POI[];
  onSelect: (poi: POI) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  isHeader?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Administrative: <Landmark className="w-3.5 h-3.5" />,
  'Lecture Theatre': <Trophy className="w-3.5 h-3.5 text-indigo-500" />,
  Library: <Book className="w-3.5 h-3.5 text-violet-500" />,
  Sports: <Trophy className="w-3.5 h-3.5 text-emerald-500" />,
  Building: <Building2 className="w-3.5 h-3.5 text-blue-500" />,
  Hostel: <Bed className="w-3.5 h-3.5 text-rose-500" />,
  Other: <MapPin className="w-3.5 h-3.5 text-slate-500" />,
};

const POPULAR_RECOMMENDATIONS = [
  'Babatunde Raji Fashola Senate Building',
  'Buba Marwa Auditorium',
  'Fatiu Ademola Akesode Library',
  'Zenith Bank ICT/CBT Centre',
  'Engineering Laboratory Complex (Ojo)'
];

const CATEGORIES = ['All', 'Library', 'Lecture Theatre', 'Administrative', 'Sports', 'Building', 'Hostel', 'Other'];

export const SearchBar: React.FC<SearchBarProps> = ({ 
  pois, 
  onSelect, 
  filterCategory, 
  setFilterCategory,
  isHeader = false,
  searchQuery,
  setSearchQuery
}) => {
  const query = searchQuery;
  const setQuery = setSearchQuery;
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<POI[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Reset highlight index when query or open state changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [query, isOpen]);

  // Load search history on mount
  useEffect(() => {
    const saved = localStorage.getItem('lasu_navigator_search_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing search history:', e);
      }
    }
  }, []);

  const saveToHistory = (poi: POI) => {
    const updated = [poi, ...history.filter((h) => h.id !== poi.id)].slice(0, 4);
    setHistory(updated);
    localStorage.setItem('lasu_navigator_search_history', JSON.stringify(updated));
  };

  const removeFromHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('lasu_navigator_search_history', JSON.stringify(updated));
  };

  const handleSelectPoi = (poi: POI) => {
    saveToHistory(poi);
    onSelect(poi);
    setQuery('');
    setIsOpen(false);
  };

  // Filter POIs based on search query and category
  const filteredPois = pois.filter((poi) => {
    const matchesCategory = filterCategory === 'All' || poi.category === filterCategory;
    if (query) {
      const q = query.toLowerCase().trim();
      return matchesCategory && (
        poi.name.toLowerCase().includes(q) ||
        poi.category.toLowerCase().includes(q) ||
        (poi.description && poi.description.toLowerCase().includes(q)) ||
        poi.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
        poi.searchAliases?.some((alias) => alias.toLowerCase().includes(q))
      );
    } else {
      return filterCategory !== 'All' && matchesCategory;
    }
  }).slice(0, 8);

  // Group search results by category
  const groupedResults: Record<string, POI[]> = {};
  filteredPois.forEach((poi) => {
    if (!groupedResults[poi.category]) {
      groupedResults[poi.category] = [];
    }
    groupedResults[poi.category].push(poi);
  });

  // Get popular recommendation POI objects
  const popularPois = POPULAR_RECOMMENDATIONS.map((name) =>
    pois.find((p) => p.name === name)
  ).filter((p): p is POI => !!p);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const results = query || filterCategory !== 'All' ? filteredPois : [...history, ...popularPois];
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelectPoi(results[activeIndex]);
      } else if (results.length > 0) {
        handleSelectPoi(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="relative w-full max-w-md flex flex-col gap-2.5">
      <div className="relative flex items-center">
        <Search className="absolute left-4.5 w-4 h-4 text-zinc-600" />
        <input
          type="text"
          className="w-full pl-11 pr-11 py-3 bg-white border border-zinc-300 text-zinc-800 rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-lasu-primary/20 focus:border-lasu-primary transition-all text-xs font-semibold"
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
            onClick={() => setQuery('')}
            className="absolute right-4 p-1 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 text-zinc-600" />
          </button>
        )}
      </div>

      {/* Quick Tags underneath search bar (Only when not in header layout) */}
      {!isHeader && (
        <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none shrink-0 max-w-full">
          {CATEGORIES.map((tag) => {
            const isActive = filterCategory === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  setFilterCategory(isActive ? 'All' : tag);
                  setIsOpen(true);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-sm",
                  isActive 
                    ? "bg-lasu-primary text-white border-transparent shadow-md"
                    : "bg-zinc-100 hover:bg-lasu-primary/10 hover:text-lasu-primary hover:border-lasu-primary/25 text-zinc-800  border-zinc-250 "
                )}
              >
                {tag === 'All' ? 'All categories' : tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Backdrop overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[990]" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Search results dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 bg-white  border border-zinc-250  rounded-2xl shadow-2xl overflow-hidden z-[1000] flex flex-col max-h-[380px] overflow-y-auto p-2 gap-2.5 scrollbar-hide",
              isHeader && "w-[320px] md:w-[380px]" // constrain width in header layout
            )}
          >
            {/* If in header layout, render category tags at the top of the search suggestions dropdown to prevent overlaps */}
            {isHeader && (
              <div className="flex gap-2 overflow-x-auto py-1.5 px-1 scrollbar-none shrink-0 max-w-full border-b border-zinc-100/60 pb-2">
                {CATEGORIES.map((tag) => {
                  const isActive = filterCategory === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        setFilterCategory(isActive ? 'All' : tag);
                        setIsOpen(true);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-sm",
                        isActive 
                          ? "bg-lasu-primary text-white border-transparent shadow-md"
                          : "bg-zinc-100 hover:bg-lasu-primary/10 hover:text-lasu-primary hover:border-lasu-primary/25 text-zinc-800  border-zinc-250 "
                      )}
                    >
                      {tag === 'All' ? 'All categories' : tag}
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* Active Query Results Grouped */}
            {query || filterCategory !== 'All' ? (
              Object.keys(groupedResults).length > 0 ? (
                Object.keys(groupedResults).map((category) => (
                  <div key={category} className="flex flex-col gap-1">
                    <div className="px-3.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-zinc-700 flex items-center gap-2 border-b border-zinc-200 pb-1">
                      {CATEGORY_ICONS[category] || <MapPin className="w-3.5 h-3.5" />}
                      {category}
                    </div>
                    {groupedResults[category].map((poi) => {
                      const globalIdx = filteredPois.findIndex(p => p.id === poi.id);
                      const isHighlighted = globalIdx === activeIndex;
                      return (
                        <button
                          key={poi.id}
                          onClick={() => handleSelectPoi(poi)}
                          className={cn(
                            "w-full px-3.5 py-2.5 text-left rounded-xl flex flex-col transition-all cursor-pointer group active:scale-[0.99]",
                            isHighlighted
                              ? "bg-lasu-primary text-white font-bold shadow-lg shadow-lasu-primary/15"
                              : "hover:bg-zinc-100  hover:shadow-sm"
                          )}
                        >
                          <span className={cn("font-bold text-xs", isHighlighted ? "text-white" : "text-zinc-900 ")}>{poi.name}</span>
                          <span className={cn("text-[10px] font-semibold mt-0.5 transition-colors line-clamp-1", isHighlighted ? "text-zinc-100" : "text-zinc-700 ")}>
                            {poi.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-400 text-xs font-semibold">
                  No campus matches found.
                </div>
              )
            ) : (
              /* Recommendations & History when query is empty */
              <div className="flex flex-col gap-4 p-2">
                {/* Search History */}
                {history.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <div className="px-2 text-[9px] font-black uppercase tracking-[0.12em] text-zinc-750 flex items-center gap-2 mb-1">
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
                            "w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99]",
                            isHighlighted
                              ? "bg-zinc-150  text-zinc-950  font-bold"
                              : "hover:bg-zinc-100  hover:shadow-sm"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Clock className="w-3.5 h-3.5 text-zinc-300 group-hover:text-lasu-primary shrink-0 transition-colors" />
                            <span className="font-bold text-xs text-zinc-850 truncate">{poi.name}</span>
                          </div>
                          <button
                            onClick={(e) => removeFromHistory(e, poi.id)}
                            className="p-1 hover:bg-zinc-200/80 rounded-full text-zinc-600 hover:text-red-500 transition-colors cursor-pointer"
                            title="Remove search"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Popular recommendations */}
                <div className="flex flex-col gap-1.5">
                  <div className="px-2 text-[9px] font-black uppercase tracking-[0.12em] text-zinc-750 flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-lasu-primary animate-pulse" />
                    Popular on Campus
                  </div>
                  {popularPois.map((poi, index) => {
                    const isHighlighted = (history.length + index) === activeIndex;
                    return (
                      <button
                        key={poi.id}
                        onClick={() => handleSelectPoi(poi)}
                        className={cn(
                          "w-full px-3 py-2.5 text-left rounded-xl flex items-center gap-2.5 transition-all cursor-pointer group active:scale-[0.99]",
                          isHighlighted
                            ? "bg-zinc-150  text-zinc-950  font-bold"
                            : "hover:bg-zinc-100  hover:shadow-sm"
                        )}
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-zinc-300 group-hover:text-lasu-primary shrink-0 transition-colors" />
                        <span className="font-bold text-xs text-zinc-850 truncate">{poi.name}</span>
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
