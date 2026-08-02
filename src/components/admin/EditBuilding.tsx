import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/firebase";
import { BuildingForm, BuildingFormValues } from "../shared/BuiildingForm";

export default function EditBuilding() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] =
    useState<Partial<BuildingFormValues> | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBuilding = async () => {
      const snap = await getDoc(doc(db, "pois", id));
      if (!snap.exists()) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }
      setInitialValues(snap.data() as Partial<BuildingFormValues>);
      setIsLoading(false);
    };

    fetchBuilding();
  }, [id]);

  const handleSubmit = async (values: BuildingFormValues) => {
    if (!id) return;
    await updateDoc(doc(db, "pois", id), {
      ...values,
      updatedAt: serverTimestamp(),
    });
    navigate("/admin/buildings");
  };

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-foreground-muted">
        Loading building...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-6 text-sm text-destructive-foreground">
        No building found with that ID.
      </div>
    );
  }

  return (
    <div>
      <div className="px-6 pt-6">
        <h2 className="text-lg font-black text-foreground">Edit Building</h2>
        <p className="text-sm text-foreground-muted mt-1">
          Changes appear on the student-facing map immediately after saving.
        </p>
      </div>
      <BuildingForm
        initialValues={initialValues ?? undefined}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
