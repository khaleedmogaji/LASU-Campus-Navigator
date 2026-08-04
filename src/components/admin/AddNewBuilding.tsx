import { useNavigate } from "react-router-dom";
import { BuildingForm, BuildingFormValues } from "../shared/BuiildingForm";
import { usePoiData } from "../../hooks/usePoiData";

export default function AddBuildingPage() {
  const navigate = useNavigate();
  const { addPoi } = usePoiData();

  const handleSubmit = async (values: BuildingFormValues) => {
    await addPoi(values);
    navigate("/admin/buildings");
  };

  return (
    <div>
      <div className="mb-2">
        <h1 className="text-xl font-black text-zinc-900">Add Building</h1>
        <p className="text-xs text-zinc-500 font-semibold mt-1">
          This will appear on the student-facing map immediately after saving.
        </p>
      </div>
      <BuildingForm onSubmit={handleSubmit} submitLabel="Add Building" />
    </div>
  );
}
