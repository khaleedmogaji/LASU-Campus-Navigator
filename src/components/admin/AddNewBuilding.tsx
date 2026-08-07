import { useNavigate } from "react-router-dom";
import { BuildingForm, BuildingFormValues } from "../shared/BuiildingForm";
import { usePoiData } from "../../hooks/usePoiData";
import { BackButton } from "../../components/admin/BackButton";

export default function AddBuildingPage() {
  const navigate = useNavigate();
  const { addPoi } = usePoiData();

  const handleSubmit = async (values: BuildingFormValues) => {
    await addPoi(values);
    navigate("/admin/buildings");
  };

  return (
    <div>
      <BackButton />
      <div className="mb-2">
        <h1 className="text-xl font-bold text-zinc-900">Add Building</h1>
        <p className="text-xs text-zinc-500 font-semibold mt-1">
          This will appear on the student-facing map immediately after saving.
        </p>
      </div>
      <BuildingForm onSubmit={handleSubmit} submitLabel="Add Building" />
    </div>
  );
}
