import React from 'react';
import { motion } from 'motion/react';
import { Info, X } from 'lucide-react';

interface SafetyInfoModalProps {
  onClose: () => void;
  onStartTour: () => void;
}

export const SafetyInfoModal: React.FC<SafetyInfoModalProps> = ({
  onClose,
  onStartTour
}) => {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/45">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-zinc-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] rounded-3xl"
      >
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-[rgb(49,30,2)] flex items-center gap-2">
            <Info className="w-6 h-6 text-lasu-primary" />
            About Campus Map
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="space-y-6 text-zinc-700">
            <div>
              <h3 className="text-sm font-black text-[rgb(49,30,2)] uppercase tracking-wider mb-2">Welcome</h3>
              <p className="text-sm leading-relaxed">
                This application helps you navigate the campus with ease. Find buildings, facilities, and get routing directions from your current location.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-black text-[rgb(49,30,2)] uppercase tracking-wider mb-2">Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Interactive map with multiple styles (CARTO Voyager, OSM, Dark)</li>
                <li>Search for points of interest (POI) across campus</li>
                <li>Get walking directions and estimated times</li>
                <li>Follow your current location in real-time</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-black text-[rgb(49,30,2)] uppercase tracking-wider mb-2">💡 Quick Tips for New Users</h3>
              <div className="space-y-3 mt-2">
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs leading-relaxed text-zinc-700 font-semibold">
                  <strong>🔍 Smart Filter Tags</strong>: Click the tags directly below the search bar to filter building categories instantly.
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs leading-relaxed text-zinc-700 font-semibold">
                  <strong>🗺️ Toggle Map Themes</strong>: Use the Layers icon on the right to switch between CARTO Voyager and OpenStreetMap views.
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black text-[rgb(49,30,2)] uppercase tracking-wider mb-2">Safety & Security</h3>
              <div className="text-sm space-y-2 text-zinc-700">
                <p><strong>LASU Security Unit:</strong> 0800-SECURITY</p>
                <p><strong>Campus Health Center:</strong> 0800-HEALTH</p>
                <p className="mt-2 text-zinc-700 font-bold italic">"If you see something, say something. Always walk in well-lit areas at night."</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black text-[rgb(49,30,2)] uppercase tracking-wider mb-2">Legend</h3>
              <div className="grid grid-cols-2 gap-3 text-sm text-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Academic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Facility</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-lasu-secondary" />
                  <span>Food</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>Library</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-zinc-200 bg-zinc-50 shrink-0 flex flex-col gap-2">
          <button
            onClick={onStartTour}
            className="w-full py-3 bg-lasu-primary text-white rounded-xl font-bold hover:bg-lasu-primary-dark transition-colors cursor-pointer text-sm shadow-md shadow-lasu-primary/10"
          >
            Start Walkthrough Tour
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-zinc-200 text-zinc-800 rounded-xl font-bold hover:bg-zinc-300 transition-all cursor-pointer text-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
