import { usePoiData } from "../../hooks/usePoiData";
import { CategoryBreakdownChart } from "../../components/admin/analytics/CategoryBreakdownChart";
import { DataCompletenessCard } from "../../components/admin/analytics/DataCompletenessCard";
import { RecentActivityList } from "../../components/admin/analytics/RecentActivityList";

export default function AdminDashboardAnalytics() {
  const { pois, loading } = usePoiData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-1 h-9 rounded-full bg-lasu-primary shrink-0" />
        <div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
            Analytics
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
            {loading ? "Loading…" : `Based on ${pois.length} landmarks`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryBreakdownChart pois={pois} />
        <DataCompletenessCard pois={pois} />
      </div>

      <RecentActivityList pois={pois} />
    </div>
  );
}
