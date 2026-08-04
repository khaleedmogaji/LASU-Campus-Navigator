import { User } from "lucide-react";
import { AdminUser } from "../../../hooks/useAdminUsers";
import { useAdminStore } from "@/store/useAdminStore";
import { cn } from "../../../lib/utils";

export function AdminUserRow({ admin }: { admin: AdminUser }) {
  const currentUser = useAdminStore((s) => s.user);
  const isYou = currentUser?.uid === admin.uid;

  return (
    <div className="flex items-center gap-3 py-3">
      <span className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center shrink-0">
        <User className="w-4 h-4" />
      </span>
      <span className="text-xs font-bold text-zinc-800 truncate flex-1">
        {admin.email}
      </span>
      {isYou && (
        <span className="text-[10px] font-black text-lasu-primary uppercase tracking-wide bg-lasu-primary/10 px-2 py-1 rounded-full">
          You
        </span>
      )}
      <span
        className={cn(
          "text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-full",
          "bg-lasu-green/10 text-lasu-green",
        )}
      >
        {admin.role}
      </span>
    </div>
  );
}
