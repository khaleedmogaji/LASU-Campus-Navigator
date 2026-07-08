import React from 'react';
import { motion } from 'motion/react';
import { POI } from '../types';

interface WelcomeBackModalProps {
  matchedPoi: POI | null;
  onContinuePreviousSession: () => void;
  onSkipToMap: () => void;
  onAskAssistant: () => void;
  onGoToDashboard: () => void;
}

export const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({
  matchedPoi,
  onContinuePreviousSession,
  onSkipToMap,
  onAskAssistant,
  onGoToDashboard
}) => {
  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/45">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="bg-white border border-zinc-250 shadow-2xl rounded-3xl p-6 w-full max-w-sm flex flex-col"
      >
        <div className="text-center mb-6">
          <span className="text-4xl block mb-3 animate-bounce">👋</span>
          <h3 className="text-lg font-black text-zinc-900 tracking-tight">Welcome back</h3>
          <p className="text-xs text-zinc-750 mt-1 font-semibold">
            Continue your previous session?
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {matchedPoi ? (
            <>
              <button
                onClick={onContinuePreviousSession}
                className="w-full py-3 bg-lasu-primary hover:bg-lasu-primary-dark text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-lasu-primary/15 cursor-pointer active:scale-[0.98]"
              >
                Continue Navigation
              </button>
              <button
                onClick={onSkipToMap}
                className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border border-zinc-200/50 cursor-pointer active:scale-[0.98]"
              >
                Skip to Map
              </button>
            </>
          ) : (
            <button
              onClick={onSkipToMap}
              className="w-full py-3 bg-lasu-primary hover:bg-lasu-primary-dark text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-lasu-primary/15 cursor-pointer active:scale-[0.98]"
            >
              Continue to Map
            </button>
          )}

          <button
            onClick={onAskAssistant}
            className="w-full py-3 bg-white hover:bg-zinc-50 text-zinc-850 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border border-zinc-200 cursor-pointer active:scale-[0.98]"
          >
            Ask Assistant
          </button>

          <div className="h-px bg-zinc-100 my-1" />

          <button
            onClick={onGoToDashboard}
            className="w-full py-2.5 text-zinc-600 hover:text-zinc-800 font-bold text-xs cursor-pointer transition-colors"
          >
            Go to Home Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};
