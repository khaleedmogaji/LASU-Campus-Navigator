import React from "react";
import { motion } from "motion/react";
import { MapPin, GraduationCap, BookOpen } from "lucide-react";

interface StatsBarProps {
  landmarkCount: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ landmarkCount }) => {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-gray-800 py-16 md:py-24 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.9)_1px,transparent_0)] bg-[size:22px_22px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-lasu-secondary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-lasu-accent/10 blur-3xl"
      />

      <div className="relative max-w-4xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-black uppercase tracking-widest text-white/80 mb-4">
            By The Numbers
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <motion.p
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="text-4xl md:text-6xl font-black text-white"
            >
              {landmarkCount}+
            </motion.p>
            <p className="text-[10px] md:text-xs text-white/60 uppercase font-black tracking-widest mt-2">
              Landmarks
            </p>
          </div>

          <div className="flex flex-col items-center border-x border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <motion.p
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 18,
                delay: 0.1,
              }}
              className="text-4xl md:text-6xl font-black text-white"
            >
              18
            </motion.p>
            <p className="text-[10px] md:text-xs text-white/60 uppercase font-black tracking-widest mt-2">
              Faculties
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <motion.p
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 18,
                delay: 0.2,
              }}
              className="text-4xl md:text-6xl font-black text-white"
            >
              90
            </motion.p>
            <p className="text-[10px] md:text-xs text-white/60 uppercase font-black tracking-widest mt-2">
              Departments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
