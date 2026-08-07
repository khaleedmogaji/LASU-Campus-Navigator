import React from "react";
import { Home, Share2, Info, Navigation } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { POI } from "../types";
import { StatusBadge } from "./StatusBadge";
import { Logo } from "./shared//Logo";
import { useNavigation } from "../context/NavigationContext";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  pois: POI[];
  onSelectPoi: (poi: POI) => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
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
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center gap-4 px-4 md:px-6 z-[2000] shrink-0 shadow-sm">
      <div className="flex items-center gap-3 shrink-0">
        <Logo size="lg" variant="stacked" showBar />
        <StatusBadge
          isOffline={isOffline}
          isUserOffCampus={isUserOffCampus}
          isSimulated={isSimulated}
          showAccuracyWarning={showAccuracyWarning}
          onEnableSimulation={onEnableSimulation}
        />
      </div>

      <div className="hidden md:flex flex-1 min-w-0 max-w-md">
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

      <div className="hidden md:block flex-1" />

      {/* Mobile Header Actions */}
      <div className="flex md:hidden items-center gap-1.5 ml-auto">
        <button
          onClick={() => navigate("/")}
          className="p-2 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95"
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
            "p-2 rounded-xl transition-all border cursor-pointer active:scale-95",
            isRoutePlannerOpen
              ? "bg-lasu-primary text-white border-lasu-primary shadow-sm"
              : "bg-white hover:bg-zinc-50 text-zinc-600 hover:text-lasu-primary border-zinc-200",
          )}
          title="Plan a Route (Directions)"
        >
          <Navigation className="w-4 h-4" />
        </button>

        <button
          onClick={shareCurrentLocation}
          className="p-2 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95"
          title="Share My Location"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsInfoOpen(true)}
          className="p-2 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-lasu-primary rounded-xl transition-all border border-zinc-200 cursor-pointer active:scale-95"
          title="Show application information"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop Header Actions */}
      <div className="hidden md:flex items-center gap-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigate("/");
              setIsRoutePlannerOpen(true);
              setSelectedPoi(null);
            }}
            className="px-3.5 py-2.5 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-600 hover:text-zinc-900 rounded-xl transition-all border border-zinc-200 cursor-pointer flex items-center gap-1.5 font-semibold text-xs"
            title="Go to Home Dashboard"
          >
            <Home className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={() => {
              setIsRoutePlannerOpen(true);
              setSelectedPoi(null);
            }}
            className={cn(
              "px-3.5 py-2.5 rounded-xl transition-all border cursor-pointer flex items-center gap-1.5 font-bold text-xs",
              isRoutePlannerOpen
                ? "bg-lasu-primary text-white border-lasu-primary shadow-sm shadow-lasu-primary/20"
                : "bg-lasu-primary/5 hover:bg-lasu-primary/10 text-lasu-primary border-lasu-primary/20",
            )}
            title="Plan a Route (Directions)"
          >
            <Navigation className="w-4 h-4" />
            Directions
          </button>
        </div>

        <span className="w-px h-6 bg-zinc-200" />

        <div className="flex items-center gap-1">
          <button
            onClick={shareCurrentLocation}
            className="p-2.5 text-zinc-400 hover:text-lasu-primary hover:bg-zinc-50 rounded-xl transition-all cursor-pointer"
            title="Share My Location"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsInfoOpen(true)}
            className="p-2.5 text-zinc-400 hover:text-lasu-primary hover:bg-zinc-50 rounded-xl transition-all cursor-pointer"
            title="Show application information"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
