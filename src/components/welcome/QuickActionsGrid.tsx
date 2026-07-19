import React from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  GraduationCap,
  MapPin,
  Navigation,
  ArrowUpRight,
} from "lucide-react";

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
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-lasu-primary/[0.035] py-16 md:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] bg-[size:22px_22px]"
      />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-3 py-1.5 rounded-full bg-lasu-primary/8 border border-lasu-primary/15 text-[10px] font-black uppercase tracking-widest text-lasu-primary mb-4">
            Get Started
          </span>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
            Everything you need,
            <br className="hidden sm:block" /> one tap away
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0 }}
            onClick={onOpenDepartments}
            className="bg-white p-6 md:p-8 rounded-[28px] flex flex-col items-center justify-center text-center gap-3 cursor-pointer relative overflow-hidden group border border-zinc-200/80 shadow-sm hover:border-lasu-primary/30 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-lasu-primary/10 transition-all duration-300"
          >
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-lasu-primary opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
            <div className="w-14 h-14 rounded-2xl bg-lasu-primary/10 text-lasu-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-sm font-black">Find Department</span>
            <span className="text-[10px] text-zinc-650 uppercase tracking-wider font-bold">
              90 Departments
            </span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.07 }}
            onClick={onOpenFaculties}
            className="bg-white p-6 md:p-8 rounded-[28px] flex flex-col items-center justify-center text-center gap-3 cursor-pointer relative overflow-hidden group border border-zinc-200/80 shadow-sm hover:border-lasu-secondary/30 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-lasu-secondary/10 transition-all duration-300"
          >
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-lasu-secondary opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
            <div className="w-14 h-14 rounded-2xl bg-lasu-secondary/10 text-lasu-secondary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-sm font-black">Find Faculty</span>
            <span className="text-[10px] text-zinc-650 uppercase tracking-wider font-bold">
              18 Schools
            </span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.14 }}
            onClick={onOpenCategories}
            className="bg-white p-6 md:p-8 rounded-[28px] flex flex-col items-center justify-center text-center gap-3 cursor-pointer relative overflow-hidden group border border-zinc-200/80 shadow-sm hover:border-sky-400/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300"
          >
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-sky-600 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-650 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-sm font-black">Explore Buildings</span>
            <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold">
              Categories
            </span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.21 }}
            onClick={onOpenRoutePlanner}
            className="bg-white p-6 md:p-8 rounded-[28px] flex flex-col items-center justify-center text-center gap-3 cursor-pointer relative overflow-hidden group border border-zinc-200/80 shadow-sm hover:border-orange-400/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300"
          >
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-orange-600 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Navigation className="w-6 h-6" />
            </div>
            <span className="text-sm font-black">Plan a Route</span>
            <span className="text-[10px] text-zinc-650 uppercase tracking-wider font-bold">
              No GPS Required
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};
