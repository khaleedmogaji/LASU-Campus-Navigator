import React from "react";
import { Home, Share2, Info, Navigation } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { POI } from "../types";
import { StatusBadge } from "./StatusBadge";
import { useNavigation } from "../context/NavigationContext";
import { cn } from "../lib/utils";

interface HeaderProps {
  pois: POI[];
  onSelectPoi: (poi: POI) => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setShowWelcome: (show: boolean) => void;
  setIsInfoOpen: (open: boolean) => void;
  shareCurrentLocation: () => void;

  // StatusBadge props
  isOffline: boolean;
  isUserOffCampus: boolean;
  isSimulated: boolean;
  showAccuracyWarning: boolean;
  onEnableSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pois,
  onSelectPoi,
  filterCategory,
  setFilterCategory,
  searchQuery,
  setSearchQuery,
  setShowWelcome,
  setIsInfoOpen,
  shareCurrentLocation,
  isOffline,
  isUserOffCampus,
  isSimulated,
  showAccuracyWarning,
  onEnableSimulation,
}) => {
  const {
    isRoutePlannerOpen,
    setIsRoutePlannerOpen,
    setSelectedPoi,
    setSheetSnap,
  } = useNavigation();

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 md:px-6 z-[2000] shrink-0 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-1.5 h-10 rounded-full bg-lasu-primary shrink-0" />
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          onClick={() => setShowWelcome(true)}
        >
          <img
            src="lasu-logo.png"
            alt="LASU Logo"
            className="w-10 h-10 object-contain shrink-0 drop-shadow-md transition-all duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="shrink-0">
            <h1 className="font-black text-[16px] leading-tight tracking-tight text-zinc-900 transition-colors duration-300 group-hover:text-lasu-primary">
              LASU Navigator
            </h1>
            <p className="text-[9px] text-lasu-primary font-black uppercase tracking-[0.18em] leading-none">
              Campus Guide
            </p>
          </div>
        </div>
        <StatusBadge
          isOffline={isOffline}
          isUserOffCampus={isUserOffCampus}
          isSimulated={isSimulated}
          showAccuracyWarning={showAccuracyWarning}
          onEnableSimulation={onEnableSimulation}
        />
      </div>

      {/* Mobile Header Actions */}
      <div className="flex md:hidden items-center gap-1.5">
        <button
          onClick={() => setShowWelcome(true)}
          className="p-2 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm"
          title="Go to Home Dashboard"
        >
          <Home className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setIsRoutePlannerOpen(true);
            setSelectedPoi(null);
            setSheetSnap("half");
          }}
          className={cn(
            "p-2 rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm",
            isRoutePlannerOpen
              ? "bg-lasu-primary text-white border-lasu-primary"
              : "bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary",
          )}
          title="Plan a Route (Directions)"
        >
          <Navigation className="w-4 h-4" />
        </button>

        <button
          onClick={shareCurrentLocation}
          className="p-2 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm"
          title="Share My Location"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsInfoOpen(true)}
          className="p-2 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm"
          title="Show application information"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop Header Actions */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={() => {
            setShowWelcome(false);
            setIsRoutePlannerOpen(true);
            setSelectedPoi(null);
          }}
          className="p-2.5 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm flex items-center gap-1.5 font-bold text-xs"
          title="Go to Home Dashboard"
        >
          <Home className="w-4.5 h-4.5" />
          Home
        </button>

        <button
          onClick={() => {
            setIsRoutePlannerOpen(true);
            setSelectedPoi(null);
          }}
          className={cn(
            "p-2.5 rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm flex items-center gap-1.5 font-bold text-xs",
            isRoutePlannerOpen
              ? "bg-lasu-primary text-white border-lasu-primary shadow-lg shadow-lasu-primary/20 scale-102"
              : "bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary",
          )}
          title="Plan a Route (Directions)"
        >
          <Navigation className="w-4.5 h-4.5" />
          Directions
        </button>

        <button
          onClick={shareCurrentLocation}
          className="p-2.5 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm"
          title="Share My Location"
        >
          <Share2 className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={() => setIsInfoOpen(true)}
          className="p-2.5 bg-zinc-100 hover:bg-lasu-primary/10 text-zinc-700 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95 shadow-sm"
          title="Show application information"
        >
          <Info className="w-4.5 h-4.5" />
        </button>

        <SearchBar
          pois={pois}
          onSelect={(poi) => {
            onSelectPoi(poi);
          }}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          isHeader={true}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </header>
  );
};
