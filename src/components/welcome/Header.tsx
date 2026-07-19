import React from "react";

export const WelcomeHeader: React.FC = () => {
  return (
    <header className="relative z-30 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src="lasu-logo.png"
          alt="LASU Logo"
          className="w-11 h-11 object-contain drop-shadow-sm"
          referrerPolicy="no-referrer"
        />
        <div>
          <h2 className="text-[12.5px] font-black tracking-widest text-lasu-primary uppercase leading-tight">
            Lagos State University
          </h2>
          <p className="text-[9.5px] text-zinc-550 font-bold uppercase tracking-wider leading-none mt-0.5">
            Official Digital Service
          </p>
        </div>
      </div>
    </header>
  );
};
