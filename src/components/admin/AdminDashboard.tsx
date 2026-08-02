import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/src/firebase";
import { useAdminStore } from "@/store/useAdminStore";
import { AdminSidebar, NAV_ITEMS } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAdminStore((s) => s.user);
  const setUser = useAdminStore((s) => s.setUser);
  const setIsAdmin = useAdminStore((s) => s.setIsAdmin);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
    navigate("/login");
  };

  const currentPage =
    NAV_ITEMS.find((item) =>
      item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    )?.label ?? "Dashboard";

  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden">
      <AdminSidebar
        isMobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
        onSignOut={handleSignOut}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar
          title={currentPage}
          user={user}
          onMenuClick={() => setIsMobileNavOpen(true)}
        />

        <main className="flex-1 overflow-y-auto relative">
          {/* Subtle dotted texture so the content area isn't flat white */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
