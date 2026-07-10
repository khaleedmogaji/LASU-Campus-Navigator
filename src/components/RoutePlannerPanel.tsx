import React from 'react';
import { X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { POI } from '../types';

interface RoutePlannerPanelProps {
  routingTo: POI | null;
  setRoutingTo: (poi: POI | null) => void;
  routingFrom: POI | null;
  setRoutingFrom: (poi: POI | null) => void;
  routeInfo: { distance: number; duration: number; coordinates: any[]; segmentsCount: number; instructions: any[] } | null;
  setRouteInfo: (info: any | null) => void;
  startSearchQuery: string;
  setStartSearchQuery: (query: string) => void;
  endSearchQuery: string;
  setEndSearchQuery: (query: string) => void;
  isStartDropdownOpen: boolean;
  setIsStartDropdownOpen: (open: boolean) => void;
  isEndDropdownOpen: boolean;
  setIsEndDropdownOpen: (open: boolean) => void;
  filteredStartPois: POI[];
  filteredEndPois: POI[];
  handleSwapRoute: () => void;
  setIsSimulated: (sim: boolean) => void;
}

export const RoutePlannerPanel: React.FC<RoutePlannerPanelProps> = ({
  routingTo,
  setRoutingTo,
  routingFrom,
  setRoutingFrom,
  routeInfo,
  setRouteInfo,
  startSearchQuery,
  setStartSearchQuery,
  endSearchQuery,
  setEndSearchQuery,
  isStartDropdownOpen,
  setIsStartDropdownOpen,
  isEndDropdownOpen,
  setIsEndDropdownOpen,
  filteredStartPois,
  filteredEndPois,
  handleSwapRoute,
  setIsSimulated,
}) => {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-hide bg-white p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
        <h3 className="text-xs font-black text-zinc-800 uppercase tracking-wider flex items-center gap-2">
          <Navigation className="w-4 h-4 text-lasu-primary animate-pulse" />
          Route Planner
        </h3>
        <button 
          onClick={() => {
            setRoutingTo(null);
            setRoutingFrom(null);
            setRouteInfo(null);
          }}
          className="text-[10px] font-black text-zinc-650 hover:text-red-600 uppercase tracking-widest transition-colors cursor-pointer"
        >
          Clear Route
        </button>
      </div>

      {/* Input Fields Container with Swap Button */}
      <div className="relative flex gap-3.5 items-center">
        {/* Vertical timeline connector line */}
        <div className="absolute left-3.5 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-zinc-200/80 pointer-events-none z-0" />

        <div className="flex-1 flex flex-col gap-3 z-10">
          {/* Start Location Input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10 z-10" />
            <input
              type="text"
              value={startSearchQuery}
              onFocus={() => {
                setIsStartDropdownOpen(true);
                setIsEndDropdownOpen(false);
              }}
              onChange={(e) => {
                setStartSearchQuery(e.target.value);
                setIsStartDropdownOpen(true);
              }}
              placeholder="Choose starting point..."
              className="w-full pl-8.5 pr-8 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-lasu-primary/20 focus:border-lasu-primary/70 focus:bg-white transition-all shadow-sm"
            />
            {startSearchQuery && (
              <button
                onClick={() => {
                  setStartSearchQuery('');
                  setRoutingFrom(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-zinc-200 rounded-full text-zinc-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Start Dropdown */}
            <AnimatePresence>
              {isStartDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[1000]" onClick={() => setIsStartDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl z-[1005] max-h-48 overflow-y-auto p-1.5 space-y-1 scrollbar-hide"
                  >
                    <button
                      onClick={() => {
                        setRoutingFrom(null);
                        setIsStartDropdownOpen(false);
                        setIsSimulated(false); // Resume real GPS tracking
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 hover:bg-lasu-primary/5 hover:text-lasu-primary flex items-center gap-2 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                      My Location (GPS)
                    </button>
                    <div className="h-px bg-zinc-100 my-1" />
                    {filteredStartPois.map((poi) => (
                      <button
                        key={poi.id}
                        onClick={() => {
                          setRoutingFrom(poi);
                          setIsStartDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-lasu-primary/5 hover:text-lasu-primary truncate cursor-pointer"
                      >
                        {poi.name}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Destination Input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-500/10 z-10" />
            <input
              type="text"
              value={endSearchQuery}
              onFocus={() => {
                setIsEndDropdownOpen(true);
                setIsStartDropdownOpen(false);
              }}
              onChange={(e) => {
                setEndSearchQuery(e.target.value);
                setIsEndDropdownOpen(true);
              }}
              placeholder="Choose destination..."
              className="w-full pl-8.5 pr-8 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-lasu-primary/20 focus:border-lasu-primary/70 focus:bg-white transition-all shadow-sm"
            />
            {endSearchQuery && (
              <button
                onClick={() => {
                  setEndSearchQuery('');
                  setRoutingTo(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-zinc-200 rounded-full text-zinc-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* End Dropdown */}
            <AnimatePresence>
              {isEndDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[1000]" onClick={() => setIsEndDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl z-[1005] max-h-48 overflow-y-auto p-1.5 space-y-1 scrollbar-hide"
                  >
                    <button
                      onClick={() => {
                        setRoutingTo(null);
                        setIsEndDropdownOpen(false);
                        setIsSimulated(false); // Resume real GPS tracking
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 hover:bg-lasu-primary/5 hover:text-lasu-primary flex items-center gap-2 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-red-500" />
                      My Location (GPS)
                    </button>
                    <div className="h-px bg-zinc-100 my-1" />
                    {filteredEndPois.map((poi) => (
                      <button
                        key={poi.id}
                        onClick={() => {
                          setRoutingTo(poi);
                          setIsEndDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-lasu-primary/5 hover:text-lasu-primary truncate cursor-pointer"
                      >
                        {poi.name}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwapRoute}
          className="p-2.5 bg-zinc-100 hover:bg-lasu-primary/10 hover:text-lasu-primary text-zinc-700 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0 border border-zinc-200 shadow-sm z-10"
          title="Swap start and end locations"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4.5 h-4.5">
            <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l-4-4M17 20l4-4"/>
          </svg>
        </button>
      </div>

      {/* Detailed directions preview summary */}
      {routeInfo && (
        <div className="bg-zinc-50 border border-zinc-200/50 rounded-2xl p-4 flex flex-col gap-2">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Selected Path Info</span>
          <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
            <span>Distance:</span>
            <span className="text-lasu-primary font-extrabold">{(routeInfo.distance / 1000).toFixed(2)} km</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
            <span>Est. Walk Time:</span>
            <span className="text-lasu-primary font-extrabold">{Math.round(routeInfo.duration / 60)} mins</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-zinc-700">
            <span>Route Segments:</span>
            <span>{routeInfo.segmentsCount} segments</span>
          </div>
        </div>
      )}
    </div>
  );
};
