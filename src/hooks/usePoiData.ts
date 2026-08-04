import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { POI } from "../types";

export function usePoiData() {
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "pois"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as POI,
        );
        setPois(fetched);
        setLoading(false);
        localStorage.setItem("poi_data_v10", JSON.stringify(fetched));
      },
      (err) => {
        console.warn("Firestore onSnapshot error for POIs:", err);
        setError("Couldn't load live data — showing cached version.");
        const cached = localStorage.getItem("poi_data_v10");
        if (cached) {
          try {
            setPois(JSON.parse(cached));
          } catch {
            // corrupt cache, ignore
          }
        }
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const addPoi = async (poi: Omit<POI, "id"> & { id?: string }) => {
    const id = poi.id ?? crypto.randomUUID();
    await setDoc(doc(db, "pois", id), {
      ...poi,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updatePoi = async (id: string, updates: Partial<POI>) => {
    await setDoc(
      doc(db, "pois", id),
      { ...updates, updatedAt: serverTimestamp() },
      { merge: true },
    );
  };

  const deletePoi = async (id: string) => {
    await deleteDoc(doc(db, "pois", id));
  };

  return { pois, loading, error, addPoi, updatePoi, deletePoi };
}
