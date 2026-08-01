import { ErrorBoundary } from "./components/ErrorBoundary";
import MapPage from "./components/MapPage";
import { Routes, Route } from "react-router-dom";
import { WelcomeScreen } from "./components/WelcomeScreen";
import LoginPage from "./components/admin/AdminLoginPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<MapPage />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
