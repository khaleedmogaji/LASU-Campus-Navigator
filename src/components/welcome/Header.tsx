import React from "react";
import { Navigation } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Logo } from "../shared/Logo";
import { ThemeToggle } from "../ThemeToggle";

interface WelcomeHeaderProps {
  onAskAssistant?: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Map", path: "/map" },
    { name: "Departments", path: "/departments" },
    { name: "Faculties", path: "/faculties" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-border-subtle/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Logo size="md" variant="stacked" />

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold uppercase tracking-wider transition-colors duration-250 ${
                  isActive
                    ? "text-primary"
                    : "text-foreground-muted hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => navigate("/map")}
            className="py-2.5 px-5 bg-secondary hover:bg-secondary-hover text-secondary-foreground rounded-xl font-heading font-bold tracking-wider uppercase text-[11px] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            <span>Open Map</span>
          </button>
        </div>
      </div>
    </header>
  );
};
