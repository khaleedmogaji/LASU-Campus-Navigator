import React from "react";
import { motion } from "motion/react";
import { Map, MessageSquare, Award } from "lucide-react";

export const FeatureHighlights: React.FC = () => {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-background py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-3 py-1.5 rounded-full bg-accent/8 border border-accent/15 text-[10px] font-bold uppercase tracking-widest text-accent mb-4">
            Why LASU Navigator
          </span>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
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
            className="relative flex flex-col items-start gap-4 bg-card p-7 md:p-8 rounded-[28px] border border-border shadow-sm overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/25 transition-all duration-300"
          >
            <Map className="absolute -right-4 -bottom-4 w-28 h-28 text-primary/[0.04]" />
            <div className="p-3.5 bg-primary/10 text-primary rounded-2xl shrink-0 relative z-10">
              <Map className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">
                Smart Navigation
              </h4>
              <p className="text-xs text-foreground-muted mt-2 leading-relaxed font-medium">
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
            className="relative flex flex-col items-start gap-4 bg-card p-7 md:p-8 rounded-[28px] border border-border shadow-sm overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-secondary/10 hover:border-secondary/25 transition-all duration-300"
          >
            <MessageSquare className="absolute -right-4 -bottom-4 w-28 h-28 text-secondary/[0.04]" />
            <div className="p-3.5 bg-secondary/10 text-secondary rounded-2xl shrink-0 relative z-10">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">
                Campus Assistant
              </h4>
              <p className="text-xs text-foreground-muted mt-2 leading-relaxed font-medium">
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
            className="relative flex flex-col items-start gap-4 bg-card p-7 md:p-8 rounded-[28px] border border-border shadow-sm overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/25 transition-all duration-300"
          >
            <Award className="absolute -right-4 -bottom-4 w-28 h-28 text-accent/[0.04]" />
            <div className="p-3.5 bg-accent/10 text-accent rounded-2xl shrink-0 relative z-10">
              <Award className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">
                Official Identity
              </h4>
              <p className="text-xs text-foreground-muted mt-2 leading-relaxed font-medium">
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
