import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import MapPage from "./components/MapPage";
import { WelcomeScreen } from "./components/WelcomeScreen";
import NotFound from "./components/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/admin/AdminLoginPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminDashboardAnalytics from "./components/admin/AdminDashboardAnalytics";
import AdminDashboardBuildings from "./components/admin/AdminDashboardBuildings";
import AdminDashboardSettings from "./components/admin/AdminDashboardSettings";
import AddNewBuilding from "./components/admin/AddNewBuilding";
import EditBuilding from "./components/admin/EditBuilding";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<MapPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <div className="p-6 text-sm text-foreground-muted">
                Overview coming soon
              </div>
            }
          />
          <Route path="buildings" element={<AdminDashboardBuildings />} />
          <Route path="buildings/new" element={<AddNewBuilding />} />
          <Route path="buildings/:id/edit" element={<EditBuilding />} />
          <Route path="analytics" element={<AdminDashboardAnalytics />} />
          <Route path="settings" element={<AdminDashboardSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
