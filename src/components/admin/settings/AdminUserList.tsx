import { useAdminUsers } from "../../../hooks/useAdminUsers";
import { AdminUserRow } from "./AdminUserRow";

export function AdminUserList() {
  const { admins, loading } = useAdminUsers();

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/5 p-5">
      <h2 className="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-lasu-gold" />
        Administrators
      </h2>
      {loading ? (
        <p className="text-xs text-zinc-500 font-semibold py-2">Loading…</p>
      ) : admins.length === 0 ? (
        <p className="text-xs text-zinc-500 font-semibold py-2">
          No admins found in the users collection.
        </p>
      ) : (
        <div className="divide-y divide-zinc-100">
          {admins.map((a) => (
            <AdminUserRow key={a.uid} admin={a} />
          ))}
        </div>
      )}
      <p className="text-[10px] text-zinc-400 font-semibold mt-3 leading-relaxed">
        Admin access is managed directly in the Firebase console, not from here.
      </p>
    </div>
  );
}
