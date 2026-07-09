import React from 'react';
import { Volume2, VolumeX, RotateCcw, ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface NavigationCardProps {
  currentInstructionStep: { text: string } | null;
  nextInstructionStep: { text: string } | null;
  routingToName: string;
  isVoiceEnabled: boolean;
  handleToggleVoice: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  replayCurrentInstruction: () => void;
  isRouteDrawerExpanded: boolean;
  setIsRouteDrawerExpanded: (expanded: boolean) => void;
  onClose: () => void;
  navCardTop: string;
}

export const getDirectionIcon = (text: string) => {
  const txt = text.toLowerCase();
  if (txt.includes('left')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
        <path d="M19 15V9a4 4 0 0 0-4-4H5M5 9l4-4M5 9l4 4"/>
      </svg>
    );
  }
  if (txt.includes('right')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
        <path d="M5 15V9a4 4 0 0 1 4-4h10M19 9l-4-4M19 9l-4 4"/>
      </svg>
    );
  }
  if (txt.includes('arrive') || txt.includes('destination')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 animate-pulse">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
};

export const NavigationCard: React.FC<NavigationCardProps> = ({
  currentInstructionStep,
  nextInstructionStep,
  routingToName,
  isVoiceEnabled,
  handleToggleVoice,
  isMuted,
  setIsMuted,
  replayCurrentInstruction,
  isRouteDrawerExpanded,
  setIsRouteDrawerExpanded,
  onClose,
  navCardTop
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className={cn(
        "absolute left-1/2 z-[2500] w-[calc(100%-2rem)] max-w-sm transition-all duration-300",
        navCardTop
      )}
    >
      <div className="bg-white border border-zinc-200 shadow-2xl rounded-3xl p-4 flex items-center gap-4">
        {/* SVG next-turn icon container */}
        <div className="w-12 h-12 rounded-2xl bg-lasu-primary/10 border border-lasu-primary/10 flex items-center justify-center shrink-0 text-lasu-primary">
          {getDirectionIcon(currentInstructionStep ? currentInstructionStep.text : '')}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-black text-lasu-primary uppercase tracking-widest leading-none block mb-0.5 animate-pulse">
            Navigation Mode
          </span>
          <h4 className="font-extrabold text-xs text-[rgb(49,30,2)] leading-snug truncate">
            {currentInstructionStep ? currentInstructionStep.text : `Walk towards ${routingToName}`}
          </h4>
          {nextInstructionStep && (
            <p className="text-[10px] text-zinc-600 font-bold truncate mt-0.5">
              Next: {nextInstructionStep.text}
            </p>
          )}
        </div>
        {/* Voice Navigation Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleToggleVoice}
            className={cn(
              "p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border shadow-sm text-[10px] font-bold gap-1",
              isVoiceEnabled ? "bg-green-50 text-green-700 border-green-200" : "bg-zinc-50 text-zinc-650 border-zinc-200"
            )}
            title={isVoiceEnabled ? "Disable Voice Engine" : "Enable Voice Engine"}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isVoiceEnabled ? "Voice ON" : "Voice OFF"}</span>
          </button>

          {isVoiceEnabled && (
            <>
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
        {/* Expand & Close Controls */}
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsRouteDrawerExpanded(!isRouteDrawerExpanded);
            }}
            className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-500 hover:text-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
          >
            {isRouteDrawerExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-500 hover:text-red-500 transition-colors flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
