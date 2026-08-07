import React from "react";
import { Logo } from "../shared/Logo";

const QUICK_LINKS = [
  { label: "Map", to: "/map" },
  { label: "Departments", to: "/#departments" },
  { label: "Faculties", to: "/#faculties" },
  { label: "About", to: "/#about" },
];

export const SiteFooter: React.FC = () => {
  return (
    <footer className="relative z-20 w-full border-t border-border bg-background-subtle">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div className="flex flex-col gap-3 max-w-xs">
          <Logo size="md" variant="inline" />
          <p className="text-xs text-foreground-muted font-medium leading-relaxed">
            Helping students find their way around LASU Ojo — buildings,
            departments, and faculties, all in one place.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Quick Links
          </span>
          <nav className="flex flex-col gap-2">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.to}
                className="text-xs font-semibold text-foreground-muted hover:text-primary transition-colors w-fit"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            About This Project
          </span>
          <p className="text-xs text-foreground-muted font-medium leading-relaxed max-w-xs">
            Built as a final-year project for Lagos State University, using
            official mapping resources and verified campus data.
          </p>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-[11px] text-muted-foreground font-semibold">
            © {new Date().getFullYear()} Lagos State University · Campus Guide &
            Navigation Service
          </p>
          <p className="text-[10px] text-muted-foreground font-medium">
            React 19 · TypeScript · Tailwind CSS · Framer Motion · Firebase ·
            Leaflet
          </p>
        </div>
      </div>
    </footer>
  );
};
