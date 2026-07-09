import React from 'react';
import { Volume2, VolumeX, RotateCcw, ChevronDown, ChevronUp, X, Navigation, CornerUpLeft, CornerUpRight, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Map as MapIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { POI } from '../types';

interface RouteDirectionsDrawerProps {
  routingTo: POI;
  routeInfo: { distance: number; duration: number; coordinates: any[]; segmentsCount: number; instructions: any[] };
  isRouteDrawerExpanded: boolean;
  setIsRouteDrawerExpanded: (expanded: boolean) => void;
  setRoutingTo: (poi: POI | null) => void;
  setRouteInfo: (info: any | null) => void;
  setFocusedCoordinate: (coord: [number, number] | null) => void;
  isVoiceEnabled: boolean;
  handleToggleVoice: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  replayCurrentInstruction: () => void;
  displayDuration: number;
  displayDistance: number;
  numTurns: number;
}

export const RouteDirectionsDrawer: React.FC<RouteDirectionsDrawerProps> = ({
  routingTo,
  routeInfo,
  isRouteDrawerExpanded,
  setIsRouteDrawerExpanded,
  setRoutingTo,
  setRouteInfo,
  setFocusedCoordinate,
  isVoiceEnabled,
  handleToggleVoice,
  isMuted,
  setIsMuted,
  replayCurrentInstruction,
  displayDuration,
  displayDistance,
  numTurns,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2500] w-[calc(100%-2rem)] max-w-sm bg-white border border-zinc-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300"
      style={{ maxHeight: isRouteDrawerExpanded ? '400px' : '96px' }}
    >
      {/* Header / Collapsed view */}
      <div 
        className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none bg-zinc-50 hover:bg-zinc-100 transition-colors group border-b border-zinc-100" 
        onClick={() => setIsRouteDrawerExpanded(!isRouteDrawerExpanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 transition-transform duration-300 group-hover:scale-105 bg-lasu-primary shadow-lasu-primary/15">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">
              Directions
            </p>
            <h3 className="font-black text-sm text-[rgb(49,30,2)] truncate pr-2">
              {routingTo.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-lasu-primary bg-lasu-primary/5 border border-lasu-primary/20 px-2 py-0.5 rounded-lg">
                {displayDuration} min
              </span>
              <span className="text-[11px] font-bold text-zinc-700">
                ({displayDistance.toFixed(2)} km • {numTurns} {numTurns === 1 ? 'turn' : 'turns'} • {routeInfo.segmentsCount} segments)
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          {/* Voice Navigation Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Voice Master ON/OFF Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleVoice();
              }}
              className={cn(
                "p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border text-[10px] font-bold gap-1",
                isVoiceEnabled ? "bg-green-50 text-green-700 border-green-200" : "bg-zinc-100 text-zinc-600 border-zinc-200"
              )}
              title={isVoiceEnabled ? "Disable Voice Engine" : "Enable Voice Engine"}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isVoiceEnabled ? "Voice ON" : "Voice OFF"}</span>
            </button>

            {isVoiceEnabled && (
              <>
                {/* Mute/Unmute */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className={cn(
                    "p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border text-xs font-bold shadow-sm",
                    isMuted ? "bg-red-50 text-red-700 border-red-200" : "bg-white text-zinc-700 border-zinc-200"
                  )}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-lasu-primary animate-pulse" />}
                </button>

                {/* Replay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    replayCurrentInstruction();
                  }}
                  className="p-2 bg-white hover:bg-zinc-50 rounded-xl text-zinc-750 transition-colors flex items-center justify-center border border-zinc-200 shadow-sm"
                  title="Replay Instruction"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-lasu-primary" />
                </button>
              </>
            )}
          </div>
          {/* ETA Display circle */}
          <div className="w-11 h-11 rounded-2xl border border-lasu-primary/15 flex flex-col items-center justify-center shrink-0 bg-lasu-primary/5 text-center leading-none">
            <span className="text-xs font-black text-lasu-primary">{displayDuration}</span>
            <span className="text-[8px] font-black text-lasu-primary uppercase tracking-tighter mt-0.5">min</span>
          </div>
        </div>
      </div>

      {/* Expanded Turn-by-Turn Steps */}
      {isRouteDrawerExpanded && (
        <div className="flex-1 overflow-y-auto border-t border-zinc-200 p-4 space-y-2 bg-zinc-50 max-h-[300px] scrollbar-hide">
          {routeInfo.instructions && routeInfo.instructions.length > 0 &&
            routeInfo.instructions.map((step: any, i: number) => {
              const text = step.text.toLowerCase();
              let Icon = Navigation;
              if (text.includes('left')) Icon = CornerUpLeft;
              else if (text.includes('right')) Icon = CornerUpRight;
              else if (text.includes('straight')) Icon = ArrowUp;
              else if (text.includes('south')) Icon = ArrowDown;
              else if (text.includes('north')) Icon = ArrowUp;
              else if (text.includes('east')) Icon = ArrowRight;
              else if (text.includes('west')) Icon = ArrowLeft;
              else if (text.includes('arrive')) Icon = MapIcon;

              return (
                <button 
                  key={i}
                  onClick={() => {
                    if (routeInfo.coordinates[step.index]) {
                      setFocusedCoordinate([routeInfo.coordinates[step.index].lat, routeInfo.coordinates[step.index].lng]);
                    }
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-lasu-primary/5 hover:text-lasu-primary transition-all border border-zinc-200 hover:border-lasu-primary/20 shadow-sm flex items-center gap-3 active:scale-[0.99] cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-lasu-primary/5 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-lasu-primary" />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-700 leading-snug">{step.text}</span>
                </button>
              );
            })
          }
        </div>
      )}
    </motion.div>
  );
};
