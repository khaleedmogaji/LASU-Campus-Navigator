import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  requireRole,
}: {
  children: React.ReactNode;
  requireRole?: string;
}) {
  const user = { role: "" };

  if (!user) return <Navigate to="/login" replace />;
  if (requireRole && user.role !== requireRole)
    return <Navigate to="/map" replace />;

  return <>{children}</>;
}
