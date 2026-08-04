import { AccountInfoCard } from "../../components/admin/settings/AccountInfoCard";
import { AdminUserList } from "../../components/admin/settings/AdminUserList";

export default function AdminDashboardSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-1 h-9 rounded-full bg-lasu-gold shrink-0" />
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
          Settings
        </h1>
      </div>

      <AccountInfoCard />
      <AdminUserList />
    </div>
  );
}
