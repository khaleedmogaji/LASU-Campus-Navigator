import React from "react";

export const SiteFooter: React.FC = () => {
  return (
    <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 border-t border-zinc-250 text-center flex flex-col items-center gap-2">
      <p className="text-[11px] text-zinc-650 font-bold uppercase tracking-wider">
        Lagos State University • Campus Guide & Navigation Service
      </p>
      <p className="text-[10px] text-zinc-600 font-semibold">
        Built with React 19 • TypeScript • Tailwind CSS • Framer Motion •
        Firebase • Leaflet
      </p>
    </footer>
  );
};
