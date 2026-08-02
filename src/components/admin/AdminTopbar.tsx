import { Menu } from "lucide-react";
import type { User } from "firebase/auth";

interface AdminTopbarProps {
  title: string;
  user: User | null;
  onMenuClick: () => void;
}

export function AdminTopbar({ title, user, onMenuClick }: AdminTopbarProps) {
  return (
    <header className="h-16 shrink-0 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 text-foreground-muted hover:text-foreground shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-black text-foreground leading-tight truncate">
            {title}
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Live session
            </span>
          </div>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-foreground leading-tight">
              {user.email?.split("@")[0]}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {user.email}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-black text-primary-foreground shadow-sm">
            {user.email?.[0]?.toUpperCase() ?? "A"}
          </div>
        </div>
      )}
    </header>
  );
}
