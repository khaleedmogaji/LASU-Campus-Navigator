import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BuildingForm, BuildingFormValues } from "../shared/BuiildingForm";
import { usePoiData } from "../../hooks/usePoiData";

export default function EditBuildingPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { pois, loading, updatePoi } = usePoiData();

  const poi = useMemo(() => pois.find((p) => p.id === id), [pois, id]);

  const handleSubmit = async (values: BuildingFormValues) => {
    if (!id) return;
    await updatePoi(id, values);
    navigate("/admin/buildings");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-lasu-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!poi) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-bold text-zinc-500">Building not found.</p>
        <button
          onClick={() => navigate("/admin/buildings")}
          className="mt-3 text-xs font-black text-lasu-primary hover:underline cursor-pointer"
        >
          ← Back to Buildings
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2">
        <h1 className="text-xl font-black text-zinc-900">Edit Building</h1>
        <p className="text-xs text-zinc-500 font-semibold mt-1">
          Changes appear on the student-facing map immediately after saving.
        </p>
      </div>
      <BuildingForm
        initialValues={poi as Partial<BuildingFormValues>}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
