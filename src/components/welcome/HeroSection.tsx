import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Navigation,
  Search,
  MessageSquare,
  X,
  ChevronRight,
  MapPin,
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

const QUICK_CHIPS = ["Library", "Hostel", "Sports", "Lecture Theatre"];

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
    <section className="relative text-center flex flex-col items-center gap-7">
      <svg
        aria-hidden="true"
        viewBox="0 0 700 180"
        className="pointer-events-none absolute -z-10 top-2 left-1/2 -translate-x-1/2 w-[640px] max-w-[150vw] h-auto opacity-[0.16]"
      >
        <motion.path
          d="M 40 150 C 180 40, 260 160, 350 90 S 560 20, 660 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 14"
          className="text-lasu-secondary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.circle
          cx="40"
          cy="150"
          r="7"
          className="text-lasu-primary"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        />
        <motion.circle
          cx="660"
          cy="60"
          r="7"
          className="text-lasu-accent"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.8, type: "spring", stiffness: 300 }}
        />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lasu-primary/8 border border-lasu-primary/15"
      >
        <MapPin className="w-3 h-3 text-lasu-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest text-lasu-primary">
          Ojo Campus • Live Wayfinding
        </span>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white p-2 shadow-xl ring-4 ring-lasu-primary/10 border border-zinc-150 flex items-center justify-center shrink-0"
      >
        <img
          src="https://lasu.edu.ng/home/img/logo1.png"
          alt="LASU Emblem"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="space-y-3 max-w-xl">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-zinc-900">
          Find any building
          <br />
          <span className="text-lasu-primary">in seconds.</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-600 font-medium leading-relaxed max-w-md mx-auto">
          Search departments, faculties, and landmarks, then get turn-by-turn
          walking directions across LASU Ojo.
        </p>
      </div>

      <div className="relative w-full max-w-lg">
        <div className="relative flex items-center">
          <Search className="absolute left-4.5 w-4.5 h-4.5 text-zinc-600" />
          <input
            type="text"
            placeholder="Search departments, faculties, libraries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-lasu-primary/15 focus:border-lasu-primary transition-all text-xs font-semibold"
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

        {!isSearchFocused && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
              Popular:
            </span>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => onExplore(chip)}
                className="px-3 py-1.5 rounded-full border border-zinc-200 bg-white hover:border-lasu-primary/30 hover:bg-lasu-primary/5 hover:text-lasu-primary text-[11px] font-bold text-zinc-650 transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mt-1">
        <button
          onClick={onStart}
          className="py-4 px-6 bg-lasu-primary hover:bg-lasu-primary-dark text-white rounded-2xl font-black shadow-lg shadow-lasu-primary/25 hover:shadow-xl hover:shadow-lasu-primary/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 text-xs tracking-wider uppercase border-none"
        >
          <Navigation className="w-4 h-4 fill-current animate-pulse text-white" />
          Start Navigation
        </button>

        <button
          onClick={() => onExplore()}
          className="py-4 px-6 bg-white border-2 border-lasu-secondary text-lasu-secondary hover:bg-lasu-secondary/5 rounded-2xl font-black active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 text-xs tracking-wider uppercase"
        >
          <Compass className="w-4 h-4" />
          Explore Campus
        </button>

        <button
          onClick={onAskAssistant}
          className="py-4 px-6 bg-transparent text-lasu-accent hover:bg-lasu-accent/5 rounded-2xl font-black active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 text-xs tracking-wider uppercase"
        >
          <MessageSquare className="w-4 h-4" />
          Ask Assistant
        </button>
      </div>
    </section>
  );
};
