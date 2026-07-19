import React from "react";

interface StatsBarProps {
  landmarkCount: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ landmarkCount }) => {
  return (
    <section className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 md:p-8">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2.5xl md:text-3.5xl font-black text-lasu-primary">
            {landmarkCount}+
          </p>
          <p className="text-[10px] md:text-[11px] text-zinc-550 uppercase font-black tracking-widest mt-1">
            Landmarks
          </p>
        </div>
        <div className="border-x border-zinc-250">
          <p className="text-2.5xl md:text-3.5xl font-black text-lasu-secondary">
            18
          </p>
          <p className="text-[10px] md:text-[11px] text-zinc-550 uppercase font-black tracking-widest mt-1">
            Faculties
          </p>
        </div>
        <div>
          <p className="text-2.5xl md:text-3.5xl font-black text-lasu-primary">
            90
          </p>
          <p className="text-[10px] md:text-[11px] text-zinc-550 uppercase font-black tracking-widest mt-1">
            Departments
          </p>
        </div>
      </div>
    </section>
  );
};
