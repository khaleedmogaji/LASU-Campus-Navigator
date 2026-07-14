import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Navigation, 
  Search, 
  BookOpen, 
  GraduationCap, 
  MapPin, 
  MessageSquare, 
  X, 
  ChevronRight, 
  Award, 
  Map 
} from 'lucide-react';
import { POI } from '../types';
import { LASU_KNOWLEDGE_BASE, Faculty } from '../lib/lasuKnowledgeBase';

interface WelcomeScreenProps {
  pois: POI[];
  onStart: () => void;
  onExplore: (category?: string) => void;
  onAskAssistant: () => void;
  onSelectPoi: (poi: POI) => void;
  onOpenRoutePlanner: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  pois, 
  onStart, 
  onExplore, 
  onAskAssistant, 
  onSelectPoi,
  onOpenRoutePlanner
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeModal, setActiveModal] = useState<'departments' | 'faculties' | 'categories' | null>(null);

  // Reference helper to map faculty to a POI on campus
  const findPOIForFaculty = (faculty: Faculty): POI | undefined => {
    const abbr = faculty.abbreviation.toLowerCase();
    const mapping: { [key: string]: string } = {
      'fa': '9',    // Faculty of Arts
      'fs': '8',    // Faculty of Science
      'fl': '7',    // Faculty of Law
      'fe': '12',   // Faculty of Education
      'fms': '10',  // Faculty of Management Sciences
      'fss': '11',  // Faculty of Social Sciences
      'stl': '14',  // School of Transport & Logistics
      'sc': '13',   // School of Communication
      'fcs': '13',  // Faculty of Clinical Sciences
      'fcit': '8',  // Faculty of Computing and Information Technology
      'stfpc': '9', // School of Tourism, Film, Performing Arts
      'slais': '4'  // School of Library
    };

    const poiId = mapping[abbr];
    if (poiId) {
      const match = pois.find(p => String(p.id).trim() === poiId);
      if (match) return match;
    }

    const normalizedFaculty = faculty.faculty.toLowerCase().replace(/faculty of|school of/g, '').trim();
    return pois.find(p => 
      p.name.toLowerCase().includes(normalizedFaculty) ||
      normalizedFaculty.includes(p.name.toLowerCase())
    );
  };

  // Live search filtering for landmarks, departments and faculties
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    
    const results: Array<{
      type: 'landmark' | 'department' | 'faculty';
      name: string;
      subText: string;
      poi?: POI;
    }> = [];

    // Search landmarks
    pois.forEach(p => {
      if (p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)) {
        results.push({
          type: 'landmark',
          name: p.name,
          subText: `${p.category} Landmark`,
          poi: p
        });
      }
    });

    // Search departments
    LASU_KNOWLEDGE_BASE.forEach(f => {
      f.departments.forEach(d => {
        const matchesName = d.name.toLowerCase().includes(query);
        const matchesAlias = d.aliases.some(alias => alias.toLowerCase().includes(query));
        if (matchesName || matchesAlias) {
          const facultyPoi = findPOIForFaculty(f);
          results.push({
            type: 'department',
            name: `${d.name} Department`,
            subText: `Under ${f.faculty}`,
            poi: facultyPoi
          });
        }
      });
    });

    // Search faculties
    LASU_KNOWLEDGE_BASE.forEach(f => {
      if (f.faculty.toLowerCase().includes(query) || f.abbreviation.toLowerCase().includes(query)) {
        const facultyPoi = findPOIForFaculty(f);
        results.push({
          type: 'faculty',
          name: f.faculty,
          subText: `${f.abbreviation} • Faculty Office`,
          poi: facultyPoi
        });
      }
    });

    return results.slice(0, 5);
  };

  const searchResults = getSearchResults();

  const handleSelectResult = (item: { poi?: POI }) => {
    if (item.poi) {
      onSelectPoi(item.poi);
    } else {
      onStart();
    }
  };

  // Categories list
  const categories = [
    { name: 'Library', count: pois.filter(p => p.category === 'Library').length, icon: '📚' },
    { name: 'Lecture Theatre', count: pois.filter(p => p.category === 'Lecture Theatre').length, icon: '🎓' },
    { name: 'Administrative', count: pois.filter(p => p.category === 'Administrative').length, icon: '🏛️' },
    { name: 'Sports', count: pois.filter(p => p.category === 'Sports').length, icon: '⚽' },
    { name: 'Building', count: pois.filter(p => p.category === 'Building').length, icon: '🏫' },
    { name: 'Hostel', count: pois.filter(p => p.category === 'Hostel').length, icon: '🏢' },
    { name: 'Other', count: pois.filter(p => p.category === 'Other').length, icon: '📍' },
  ];

  return (
    <div className="min-h-screen w-full bg-white text-[rgb(49,30,2)] transition-colors duration-300 relative overflow-x-hidden flex flex-col justify-between">

      {/* Header bar */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://lasu.edu.ng/home/img/logo1.png"
            alt="LASU Logo"
            className="w-11 h-11 object-contain drop-shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-[12.5px] font-black tracking-widest text-lasu-primary uppercase leading-tight">Lagos State University</h2>
            <p className="text-[9.5px] text-zinc-550 font-bold uppercase tracking-wider leading-none mt-0.5">Official Digital Service</p>
          </div>
        </div>

      </header>

      {/* Main Page Area */}
      <main className="relative z-20 flex-1 max-w-4xl w-full mx-auto px-6 py-8 flex flex-col justify-center gap-8 md:gap-12">
        
        {/* Hero Section */}
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
              Navigate Lagos State University with confidence. Find departments, offices, faculties, and landmarks using turn-by-turn route pathfinding.
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
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-lasu-green/20 focus:border-lasu-green transition-all text-xs font-semibold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1 hover:bg-zinc-100 rounded-full"
                >
                  <X className="w-3.5 h-3.5 text-zinc-650" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown overlay */}
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
                          <p className="text-xs font-black text-zinc-850 truncate leading-snug">{item.name}</p>
                          <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">{item.subText}</p>
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

        {/* Quick Actions Grid */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest text-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveModal('departments')}
              className="glass-card glass-card-hover p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer relative overflow-hidden group"
            >
              <div className="w-10 h-10 rounded-2xl bg-lasu-primary/10 text-lasu-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-black">Find Department</span>
              <span className="text-[10px] text-zinc-650 uppercase tracking-wider font-bold">90 Departments</span>
            </button>

            <button
              onClick={() => setActiveModal('faculties')}
              className="glass-card glass-card-hover p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer relative overflow-hidden group"
            >
              <div className="w-10 h-10 rounded-2xl bg-lasu-secondary/10 text-lasu-secondary flex items-center justify-center transition-transform group-hover:scale-105">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-black">Find Faculty</span>
              <span className="text-[10px] text-zinc-650 uppercase tracking-wider font-bold">18 Schools</span>
            </button>

            <button
              onClick={() => setActiveModal('categories')}
              className="glass-card glass-card-hover p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer relative overflow-hidden group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-650 flex items-center justify-center transition-transform group-hover:scale-105">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-black">Explore Buildings</span>
              <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">Categories</span>
            </button>

            <button
              onClick={onOpenRoutePlanner}
              className="glass-card glass-card-hover p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer relative overflow-hidden group"
            >
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center transition-transform group-hover:scale-105">
                <Navigation className="w-5 h-5" />
              </div>
              <span className="text-xs font-black">Plan a Route</span>
              <span className="text-[10px] text-zinc-650 uppercase tracking-wider font-bold">No GPS Required</span>
            </button>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4 items-start bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="p-3 bg-lasu-primary/10 text-lasu-primary rounded-2xl shrink-0">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-wider text-zinc-900">Smart Navigation</h4>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-medium">Turn-by-turn routing across Ojo walkways using coordinate pathfinding.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="p-3 bg-lasu-secondary/10 text-lasu-secondary rounded-2xl shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-wider text-zinc-900">Campus Assistant</h4>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-medium">Rule-based campus assistant for finding faculties, departments, and offices.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="p-3 bg-lasu-accent/10 text-lasu-accent rounded-2xl shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-wider text-zinc-900">Official Identity</h4>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-medium">Built using official LASU mapping resources and verified data directories.</p>
            </div>
          </div>
        </section>

        {/* Statistics section */}
        <section className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 md:p-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2.5xl md:text-3.5xl font-black text-lasu-primary">{pois.length}+</p>
              <p className="text-[10px] md:text-[11px] text-zinc-550 uppercase font-black tracking-widest mt-1">Landmarks</p>
            </div>
            <div className="border-x border-zinc-250">
              <p className="text-2.5xl md:text-3.5xl font-black text-lasu-secondary">18</p>
              <p className="text-[10px] md:text-[11px] text-zinc-550 uppercase font-black tracking-widest mt-1">Faculties</p>
            </div>
            <div>
              <p className="text-2.5xl md:text-3.5xl font-black text-lasu-primary">90</p>
              <p className="text-[10px] md:text-[11px] text-zinc-550 uppercase font-black tracking-widest mt-1">Departments</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 border-t border-zinc-250 text-center flex flex-col items-center gap-2">
        <p className="text-[11px] text-zinc-650 font-bold uppercase tracking-wider">
          Lagos State University • Campus Guide & Navigation Service
        </p>
        <p className="text-[10px] text-zinc-600 font-semibold">
          Built with React 19 • TypeScript • Tailwind CSS • Framer Motion • Firebase • Leaflet

        </p>
      </footer>

      {/* ── MODALS FOR QUICK ACTIONS ───────────────────────────────── */}
      <AnimatePresence>
        {/* Department modal */}
        {activeModal === 'departments' && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/45">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-zinc-250"
            >
              <div className="p-5 border-b border-zinc-250 flex items-center justify-between shrink-0 bg-zinc-50">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-lasu-green" />
                  Select Department (90 Available)
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1 bg-white">
                {LASU_KNOWLEDGE_BASE.map((f, fIdx) => (
                  <div key={fIdx} className="space-y-2.5">
                    <h4 className="text-xs font-black text-lasu-green uppercase tracking-wider border-b border-zinc-200 pb-1.5">
                      {f.faculty} ({f.abbreviation})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {f.departments.map((d, dIdx) => (
                        <button
                          key={dIdx}
                          onClick={() => {
                            const facultyPoi = findPOIForFaculty(f);
                            if (facultyPoi) {
                              onSelectPoi(facultyPoi);
                            } else {
                              onStart();
                            }
                            setActiveModal(null);
                          }}
                          className="text-left px-3 py-2 rounded-xl border border-zinc-250 hover:bg-zinc-50 hover:border-lasu-green/20 hover:text-lasu-green transition-all text-xs font-semibold text-zinc-800 truncate cursor-pointer"
                        >
                          {d.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Faculty Modal */}
        {activeModal === 'faculties' && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/45">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[80vh] border border-zinc-250"
            >
              <div className="p-5 border-b border-zinc-250 flex items-center justify-between shrink-0 bg-zinc-50">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-lasu-gold" />
                  Select Faculty / School
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-2.5 custom-scrollbar flex-1 bg-white">
                {LASU_KNOWLEDGE_BASE.map((f, fIdx) => (
                  <button
                    key={fIdx}
                    onClick={() => {
                      const facultyPoi = findPOIForFaculty(f);
                      if (facultyPoi) {
                        onSelectPoi(facultyPoi);
                      } else {
                        onStart();
                      }
                      setActiveModal(null);
                    }}
                    className="w-full text-left p-3.5 rounded-2xl border border-zinc-200 hover:bg-zinc-50 hover:border-lasu-green/20 hover:text-lasu-green transition-all duration-200 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-black text-zinc-800 group-hover:text-lasu-green truncate">{f.faculty}</p>
                      <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">{f.departments.length} Departments</p>
                    </div>
                    <span className="text-[10px] font-black uppercase text-lasu-green border border-lasu-green/20 px-2 py-0.5 rounded-lg shrink-0">
                      {f.abbreviation}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Explore Categories Modal */}
        {activeModal === 'categories' && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/45">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col border border-zinc-250"
            >
              <div className="p-5 border-b border-zinc-250 flex items-center justify-between shrink-0 bg-zinc-50">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-sky-500" />
                  Explore Landmarks
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-zinc-200 rounded-full text-zinc-400 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="p-5 space-y-2 bg-white">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onExplore(cat.name);
                      setActiveModal(null);
                    }}
                    className="w-full text-left p-3.5 rounded-2xl border border-zinc-200 hover:bg-zinc-50 hover:border-lasu-green/20 hover:text-lasu-green transition-all duration-200 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-xs font-black text-zinc-800">{cat.name}</span>
                    </div>
                    <span className="text-[11px] text-zinc-650 font-bold">
                      {cat.count} landmarks
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
