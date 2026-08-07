import React from "react";
import { motion } from "motion/react";
import {
  Info,
  X,
  Shield,
  MapPin,
  Sparkles,
  Search,
  Layers as LayersIcon,
  Navigation,
  BookOpen,
  GraduationCap,
  Landmark,
  Trophy,
  Building2,
  BedDouble,
} from "lucide-react";

interface SafetyInfoModalProps {
  onClose: () => void;
  onStartTour: () => void;
}

const CATEGORY_LEGEND = [
  { name: "Library", icon: BookOpen, color: "bg-blue-500" },
  { name: "Lecture Theatre", icon: GraduationCap, color: "bg-amber-500" },
  { name: "Administrative", icon: Landmark, color: "bg-purple-500" },
  { name: "Sports", icon: Trophy, color: "bg-emerald-500" },
  { name: "Building", icon: Building2, color: "bg-secondary" },
  { name: "Hostel", icon: BedDouble, color: "bg-rose-500" },
  { name: "Other", icon: MapPin, color: "bg-zinc-400" },
];

export const SafetyInfoModal: React.FC<SafetyInfoModalProps> = ({
  onClose,
  onStartTour,
}) => {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-card border border-border shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] rounded-3xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-primary" />
            </span>
            About LASU Navigator
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className="space-y-7 text-foreground-muted">
            {/* Intro */}
            <p className="text-sm leading-relaxed">
              Find any building on the Ojo campus, get turn-by-turn walking
              directions, and see where you are as you move — no GPS experience
              required.
            </p>

            {/* Features */}
            <div>
              <h3 className="text-xs font-black text-foreground uppercase tracking-wider mb-3">
                What you can do
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2.5">
                  <LayersIcon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    Switch between CARTO Voyager and OpenStreetMap views
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Search className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    Search departments, faculties, and landmarks by name
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Navigation className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    Get walking directions with live distance and time estimates
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Track your position on the map as you walk</span>
                </li>
              </ul>
            </div>

            {/* Quick tips */}
            <div>
              <h3 className="text-xs font-black text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                Quick tips
              </h3>
              <div className="space-y-2">
                <div className="bg-muted rounded-xl p-3 text-xs leading-relaxed text-foreground-muted">
                  <span className="font-bold text-foreground">
                    Filter fast —{" "}
                  </span>
                  tap a category tag under the search bar to jump straight to
                  libraries, hostels, or lecture theatres.
                </div>
                <div className="bg-muted rounded-xl p-3 text-xs leading-relaxed text-foreground-muted">
                  <span className="font-bold text-foreground">
                    Switch views —{" "}
                  </span>
                  use the layers control on the map to change how the campus is
                  drawn.
                </div>
              </div>
            </div>

            {/* Safety */}
            <div>
              <h3 className="text-xs font-black text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-destructive" />
                Emergency contacts
              </h3>
              <div className="rounded-xl border border-border-subtle divide-y divide-border-subtle overflow-hidden text-sm">
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-muted/60">
                  <span className="font-semibold text-foreground">
                    Campus Security
                  </span>
                  <span className="text-foreground-muted text-xs font-mono">
                    [ADD NUMBER]
                  </span>
                </div>
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-muted/60">
                  <span className="font-semibold text-foreground">
                    Campus Health Center
                  </span>
                  <span className="text-foreground-muted text-xs font-mono">
                    [ADD NUMBER]
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-foreground-muted italic">
                Walk in well-lit, populated areas after dark, and share your
                live location with someone you trust when heading somewhere
                unfamiliar.
              </p>
            </div>

            {/* Legend */}
            <div>
              <h3 className="text-xs font-black text-foreground uppercase tracking-wider mb-3">
                Map legend
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                {CATEGORY_LEGEND.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${item.color}`}
                      >
                        <Icon
                          className="w-3 h-3 text-white"
                          strokeWidth={2.5}
                        />
                      </span>
                      <span className="text-foreground-muted">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-border bg-background-subtle shrink-0 flex flex-col gap-2">
          <button
            onClick={onStartTour}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary-hover transition-colors text-sm shadow-md shadow-primary/10"
          >
            Start walkthrough tour
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-muted text-foreground rounded-xl font-bold hover:bg-border-subtle transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
