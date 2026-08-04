import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Logo } from "../shared/Logo";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  X,
  Compass,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Buildings", to: "/admin/buildings", icon: Building2, end: false },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3, end: false },
  { label: "Settings", to: "/admin/settings", icon: Settings, end: false },
];

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onSignOut: () => void;
}

export function AdminSidebar({
  isMobileOpen,
  onMobileClose,
  onSignOut,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[2999] bg-black/40"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-[3000] w-64 shrink-0 flex flex-col",
          "bg-card border-r border-border transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo / brand */}
        <div className="h-16 flex items-center justify-between gap-2.5 px-5 border-b border-border shrink-0">
          <Logo />
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-foreground-muted hover:bg-muted hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-accent" />
                  )}
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-border shrink-0">
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
