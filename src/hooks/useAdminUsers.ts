import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export interface AdminUser {
  uid: string;
  email: string;
  role: string;
}

export function useAdminUsers() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "admin"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setAdmins(
          snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }) as AdminUser),
        );
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load admin users:", err);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  return { admins, loading };
}
