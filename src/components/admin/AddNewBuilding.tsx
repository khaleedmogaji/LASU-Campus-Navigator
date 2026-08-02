import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/firebase";
import { useAdminStore } from "@/store/useAdminStore";
import { BuildingForm, BuildingFormValues } from "../shared/BuiildingForm";

export default function AddNewBuilding() {
  const navigate = useNavigate();
  const user = useAdminStore((s) => s.user);

  const handleSubmit = async (values: BuildingFormValues) => {
    await addDoc(collection(db, "pois"), {
      ...values,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: user?.uid ?? null,
    });
    navigate("/admin/buildings");
  };

  return (
    <div>
      <div className="px-3 pt-3">
        <h2 className="text-lg font-black text-foreground">Add Building</h2>
        <p className="text-sm text-foreground-muted mt-1">
          This will appear on the student-facing map immediately after saving.
        </p>
      </div>
      <BuildingForm onSubmit={handleSubmit} submitLabel="Add Building" />
    </div>
  );
}
