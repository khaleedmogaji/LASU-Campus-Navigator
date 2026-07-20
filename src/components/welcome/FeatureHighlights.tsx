import React from "react";
import { motion } from "motion/react";
import { Map, MessageSquare, Award } from "lucide-react";

export const FeatureHighlights: React.FC = () => {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-3 py-1.5 rounded-full bg-lasu-accent/8 border border-lasu-accent/15 text-[10px] font-black uppercase tracking-widest text-lasu-accent mb-4">
            Why LASU Navigator
          </span>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
            Built for how students
            <br className="hidden sm:block" /> actually move
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col items-start gap-4 bg-white p-7 md:p-8 rounded-[28px] border border-zinc-200 shadow-sm overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-lasu-primary/10 hover:border-lasu-primary/25 transition-all duration-300"
          >
            <Map className="absolute -right-4 -bottom-4 w-28 h-28 text-lasu-primary/[0.04]" />
            <div className="p-3.5 bg-lasu-primary/10 text-lasu-primary rounded-2xl shrink-0 relative z-10">
              <Map className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h4 className="font-black text-sm uppercase tracking-wider text-zinc-900">
                Smart Navigation
              </h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-medium">
                Turn-by-turn routing across Ojo walkways using coordinate
                pathfinding.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="relative flex flex-col items-start gap-4 bg-white p-7 md:p-8 rounded-[28px] border border-zinc-200 shadow-sm overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-lasu-secondary/10 hover:border-lasu-secondary/25 transition-all duration-300"
          >
            <MessageSquare className="absolute -right-4 -bottom-4 w-28 h-28 text-lasu-secondary/[0.04]" />
            <div className="p-3.5 bg-lasu-secondary/10 text-lasu-secondary rounded-2xl shrink-0 relative z-10">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h4 className="font-black text-sm uppercase tracking-wider text-zinc-900">
                Campus Assistant
              </h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-medium">
                Rule-based campus assistant for finding faculties, departments,
                and offices.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="relative flex flex-col items-start gap-4 bg-white p-7 md:p-8 rounded-[28px] border border-zinc-200 shadow-sm overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-lasu-accent/10 hover:border-lasu-accent/25 transition-all duration-300"
          >
            <Award className="absolute -right-4 -bottom-4 w-28 h-28 text-lasu-accent/[0.04]" />
            <div className="p-3.5 bg-lasu-accent/10 text-lasu-accent rounded-2xl shrink-0 relative z-10">
              <Award className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h4 className="font-black text-sm uppercase tracking-wider text-zinc-900">
                Official Identity
              </h4>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-medium">
                Built using official LASU mapping resources and verified data
                directories.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
