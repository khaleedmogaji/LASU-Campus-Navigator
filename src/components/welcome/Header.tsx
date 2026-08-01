import React from "react";
import { Navigation, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../shared/Logo";

interface WelcomeHeaderProps {
  onAskAssistant?: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  onAskAssistant,
}) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-transparent">
      <Logo size="md" variant="inline" />

      <div className="flex items-center gap-2">
        {onAskAssistant && (
          <button
            onClick={onAskAssistant}
            title="Ask Assistant"
            className="w-9 h-9 rounded-full flex items-center justify-center text-lasu-accent hover:bg-lasu-accent/10 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => navigate("/map")}
          className="py-2.5 px-3.5 sm:px-5 bg-lasu-primary hover:bg-lasu-primary-dark text-white rounded-xl font-black shadow-sm active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 text-[11px] tracking-wider uppercase"
        >
          <Navigation className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Start Navigation</span>
        </button>
      </div>
    </header>
  );
};
