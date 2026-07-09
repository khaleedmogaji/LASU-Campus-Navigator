import React from 'react';

interface HomePanelContentProps {
  isMobile?: boolean;
}

export const HomePanelContent: React.FC<HomePanelContentProps> = ({ isMobile = false }) => {
  const paddingClass = isMobile ? "p-4 space-y-4 pb-12" : "p-5 space-y-4";

  return (
    <div className={paddingClass}>
      {/* Brand strip */}
      <div className="relative overflow-hidden rounded-2xl p-4 bg-zinc-50 border border-zinc-200 shadow-md">
        <p className="text-[9px] font-black text-lasu-secondary uppercase tracking-[0.18em] mb-1">LASU Campus Navigator</p>
        <h2 className="text-base font-black text-lasu-primary leading-tight">Find your way <span className="text-lasu-secondary">around campus</span></h2>
        <p className="text-[10px] text-zinc-700 mt-1.5 font-semibold">Search, navigate & explore all landmarks.</p>
      </div>

      {/* Tips Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-zinc-700 uppercase tracking-wider pl-1">
          Quick Navigation Tips
        </h3>
        <div className="space-y-2.5">
          {[
            { num: '01', icon: 'Tag', title: 'Filter by Category', desc: 'Tap the category filter tags below the search bar to highlight specific building types on the map.' },
            { num: '02', icon: 'Layers', title: 'Change Map Themes', desc: 'Switch between CARTO Voyager and OpenStreetMap views via the Layers button.' },
          ].map((tip) => (
            <div 
              key={tip.num} 
              className="group flex gap-3.5 bg-white border border-zinc-150 rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default"
            >
              <div className="shrink-0 w-8.5 h-8.5 rounded-xl bg-orange-50 border border-orange-100/85 text-orange-600 flex items-center justify-center transition-colors group-hover:bg-orange-100/50">
                {tip.title.includes('Filter') ? '🏷️' : '🥞'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span className="text-[9px] font-black text-orange-500/60 tabular-nums">{tip.num}</span>
                  <p className="text-[11px] font-black text-zinc-800 leading-tight">{tip.title}</p>
                </div>
                <p className="text-[10.5px] text-zinc-700 leading-relaxed font-semibold">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
