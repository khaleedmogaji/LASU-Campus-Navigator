import React from "react";
import { Map, MessageSquare, Award } from "lucide-react";

export const FeatureHighlights: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex gap-4 items-start bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="p-3 bg-lasu-primary/10 text-lasu-primary rounded-2xl shrink-0">
          <Map className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-black text-xs uppercase tracking-wider text-zinc-900">
            Smart Navigation
          </h4>
          <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-medium">
            Turn-by-turn routing across Ojo walkways using coordinate
            pathfinding.
          </p>
        </div>
      </div>
      <div className="flex gap-4 items-start bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="p-3 bg-lasu-secondary/10 text-lasu-secondary rounded-2xl shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-black text-xs uppercase tracking-wider text-zinc-900">
            Campus Assistant
          </h4>
          <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-medium">
            Rule-based campus assistant for finding faculties, departments, and
            offices.
          </p>
        </div>
      </div>
      <div className="flex gap-4 items-start bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="p-3 bg-lasu-accent/10 text-lasu-accent rounded-2xl shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-black text-xs uppercase tracking-wider text-zinc-900">
            Official Identity
          </h4>
          <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-medium">
            Built using official LASU mapping resources and verified data
            directories.
          </p>
        </div>
      </div>
    </section>
  );
};
