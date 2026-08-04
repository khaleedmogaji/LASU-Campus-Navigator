import { ShieldCheck } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";

export function AccountInfoCard() {
  const user = useAdminStore((s) => s.user);

  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/5 p-5 flex items-center gap-4">
      <span className="w-11 h-11 rounded-full bg-lasu-primary/10 text-lasu-primary flex items-center justify-center shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-black text-zinc-900 truncate">
          {user?.email ?? "Unknown account"}
        </p>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
          Signed in · Administrator
        </p>
      </div>
    </div>
  );
}
