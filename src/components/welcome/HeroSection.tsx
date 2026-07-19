import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Navigation,
  Search,
  MessageSquare,
  X,
  ChevronRight,
} from "lucide-react";
import { POI } from "../../types";
import { LASU_KNOWLEDGE_BASE } from "../../lib/lasuKnowledgeBase";
import { findPOIForFaculty } from "../../lib/findPoiForFaculty";

interface SearchResultItem {
  type: "landmark" | "department" | "faculty";
  name: string;
  subText: string;
  poi?: POI;
}

interface HeroSectionProps {
  pois: POI[];
  onStart: () => void;
  onExplore: (category?: string) => void;
  onAskAssistant: () => void;
  onSelectPoi: (poi: POI) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  pois,
  onStart,
  onExplore,
  onAskAssistant,
  onSelectPoi,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const getSearchResults = (): SearchResultItem[] => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();

    const results: SearchResultItem[] = [];

    pois.forEach((p) => {
      if (
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      ) {
        results.push({
          type: "landmark",
          name: p.name,
          subText: `${p.category} Landmark`,
          poi: p,
        });
      }
    });

    LASU_KNOWLEDGE_BASE.forEach((f) => {
      f.departments.forEach((d) => {
        const matchesName = d.name.toLowerCase().includes(query);
        const matchesAlias = d.aliases.some((alias) =>
          alias.toLowerCase().includes(query),
        );
        if (matchesName || matchesAlias) {
          const facultyPoi = findPOIForFaculty(pois, f);
          results.push({
            type: "department",
            name: `${d.name} Department`,
            subText: `Under ${f.faculty}`,
            poi: facultyPoi,
          });
        }
      });
    });

    LASU_KNOWLEDGE_BASE.forEach((f) => {
      if (
        f.faculty.toLowerCase().includes(query) ||
        f.abbreviation.toLowerCase().includes(query)
      ) {
        const facultyPoi = findPOIForFaculty(pois, f);
        results.push({
          type: "faculty",
          name: f.faculty,
          subText: `${f.abbreviation} • Faculty Office`,
          poi: facultyPoi,
        });
      }
    });

    return results.slice(0, 5);
  };

  const searchResults = getSearchResults();

  const handleSelectResult = (item: SearchResultItem) => {
    if (item.poi) {
      onSelectPoi(item.poi);
    } else {
      onStart();
    }
  };

  return (
    <section className="text-center flex flex-col items-center gap-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white p-2.5 shadow-xl border border-zinc-150 flex items-center justify-center shrink-0"
      >
        <img
          src="https://lasu.edu.ng/home/img/logo1.png"
          alt="LASU Emblem"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="space-y-3">
        <h1 className="text-3.5xl md:text-5.5xl font-black tracking-tight leading-tight text-lasu-primary">
          LASU Campus Navigator
        </h1>
        <p className="text-xs md:text-base text-zinc-650 font-semibold max-w-lg leading-relaxed mx-auto">
          Navigate Lagos State University with confidence. Find departments,
          offices, faculties, and landmarks using turn-by-turn route
          pathfinding.
        </p>
      </div>

      {/* Quick Search */}
      <div className="relative w-full max-w-lg mt-2">
        <div className="relative flex items-center">
          <Search className="absolute left-4.5 w-4.5 h-4.5 text-zinc-600" />
          <input
            type="text"
            placeholder="Search departments, faculties, libraries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-lasu-green/20 focus:border-lasu-green transition-all text-xs font-semibold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 p-1 hover:bg-zinc-100 rounded-full"
            >
              <X className="w-3.5 h-3.5 text-zinc-650" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isSearchFocused && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden z-40 text-left p-1.5 space-y-1"
            >
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectResult(item)}
                    className="w-full text-left px-4 py-3 hover:bg-zinc-50 rounded-xl transition-all duration-200 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-black text-zinc-850 truncate leading-snug">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">
                        {item.subText}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-lasu-green transition-colors" />
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-zinc-600 font-bold">
                  No matching landmarks or departments found
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-4">
        <button
          onClick={onStart}
          className="py-4 px-6 bg-lasu-primary hover:bg-lasu-primary-dark text-white rounded-2xl font-black shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 text-xs tracking-wider uppercase border-none"
        >
          <Navigation className="w-4 h-4 fill-current animate-pulse text-white" />
          Start Navigation
        </button>
        <button
          onClick={() => onExplore()}
          className="py-4 px-6 bg-lasu-secondary hover:bg-lasu-secondary-dark text-white rounded-2xl font-black shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 text-xs tracking-wider uppercase border-none"
        >
          <Compass className="w-4 h-4 text-white" />
          Explore Campus
        </button>
        <button
          onClick={onAskAssistant}
          className="py-4 px-6 bg-lasu-accent hover:bg-lasu-accent-dark text-white rounded-2xl font-black shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 text-xs tracking-wider uppercase border-none"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          Ask Assistant
        </button>
      </div>
    </section>
  );
};
