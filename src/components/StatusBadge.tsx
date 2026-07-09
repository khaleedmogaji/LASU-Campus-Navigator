import React from 'react';
import { WifiOff, Map as MapIcon, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  isOffline: boolean;
  isUserOffCampus: boolean;
  isSimulated: boolean;
  showAccuracyWarning: boolean;
  onEnableSimulation: () => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  isOffline,
  isUserOffCampus,
  isSimulated,
  showAccuracyWarning,
  onEnableSimulation,
}) => {
  if (isOffline) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[10px] font-bold shadow-sm animate-pulse whitespace-nowrap">
        <WifiOff className="w-3.5 h-3.5 text-amber-600" />
        <span className="hidden xs:inline">Offline Mode</span>
        <span className="xs:hidden">Offline</span>
      </div>
    );
  }
  
  if (isUserOffCampus && !isSimulated) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 text-red-800 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap">
        <MapIcon className="w-3.5 h-3.5 text-red-600 animate-bounce" />
        <span className="hidden sm:inline">Outside Campus Bounds</span>
        <span className="sm:hidden">Off-Campus</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEnableSimulation();
          }}
          className="ml-1 bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded-lg text-[9px] font-black uppercase transition-all shadow-sm active:scale-95 animate-pulse cursor-pointer border-none"
        >
          Simulate
        </button>
      </div>
    );
  }
  
  if (showAccuracyWarning) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-lasu-secondary/10 border border-lasu-secondary/20 text-lasu-secondary rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap">
        <AlertTriangle className="w-3.5 h-3.5 text-lasu-secondary animate-pulse" />
        <span className="hidden xs:inline">Weak GPS Signal</span>
        <span className="xs:hidden">Weak GPS</span>
      </div>
    );
  }
  
  return null;
};
