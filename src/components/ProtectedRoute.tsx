import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAdminStore } from "@/store/useAdminStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAdminStore((s) => s.user);
  const isAdmin = useAdminStore((s) => s.isAdmin);
  const isLoading = useAdminStore((s) => s.isLoading);
  const setUser = useAdminStore((s) => s.setUser);
  const setIsAdmin = useAdminStore((s) => s.setIsAdmin);
  const setIsLoading = useAdminStore((s) => s.setIsLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      if (
        firebaseUser.email === "khaleedmogaji@gmail.com" &&
        firebaseUser.emailVerified
      ) {
        setUser(firebaseUser);
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      const role = userDoc.exists() ? userDoc.data().role : null;

      setUser(firebaseUser);
      setIsAdmin(role === "admin");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setIsAdmin, setIsLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
