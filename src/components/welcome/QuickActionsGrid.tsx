import React from "react";
import { BookOpen, GraduationCap, MapPin, Navigation } from "lucide-react";

interface QuickActionsGridProps {
  onOpenDepartments: () => void;
  onOpenFaculties: () => void;
  onOpenCategories: () => void;
  onOpenRoutePlanner: () => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onOpenDepartments,
  onOpenFaculties,
  onOpenCategories,
  onOpenRoutePlanner,
}) => {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest text-center">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={onOpenDepartments}
          className="glass-card glass-card-hover p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer relative overflow-hidden group"
        >
          <div className="w-10 h-10 rounded-2xl bg-lasu-primary/10 text-lasu-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xs font-black">Find Department</span>
          <span className="text-[10px] text-zinc-650 uppercase tracking-wider font-bold">
            90 Departments
          </span>
        </button>

        <button
          onClick={onOpenFaculties}
          className="glass-card glass-card-hover p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer relative overflow-hidden group"
        >
          <div className="w-10 h-10 rounded-2xl bg-lasu-secondary/10 text-lasu-secondary flex items-center justify-center transition-transform group-hover:scale-105">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xs font-black">Find Faculty</span>
          <span className="text-[10px] text-zinc-650 uppercase tracking-wider font-bold">
            18 Schools
          </span>
        </button>

        <button
          onClick={onOpenCategories}
          className="glass-card glass-card-hover p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer relative overflow-hidden group"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-650 flex items-center justify-center transition-transform group-hover:scale-105">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-xs font-black">Explore Buildings</span>
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">
            Categories
          </span>
        </button>

        <button
          onClick={onOpenRoutePlanner}
          className="glass-card glass-card-hover p-5 rounded-3xl flex flex-col items-center justify-center text-center gap-2 cursor-pointer relative overflow-hidden group"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center transition-transform group-hover:scale-105">
            <Navigation className="w-5 h-5" />
          </div>
          <span className="text-xs font-black">Plan a Route</span>
          <span className="text-[10px] text-zinc-650 uppercase tracking-wider font-bold">
            No GPS Required
          </span>
        </button>
      </div>
    </section>
  );
};
