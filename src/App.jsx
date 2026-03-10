import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/public/Home";
import Destination from "./pages/public/Destination";
import Crew from "./pages/public/Crew";
import Technology from "./pages/public/Technology";
import Login from "./pages/dashboard/Login";
import Overview from "./pages/dashboard/Overview";
import Destinations from "./pages/dashboard/Destinations";
import DashboardCrewPage from "./pages/dashboard/Crew";
import DashboardTechnologyPage from "./pages/dashboard/Technology";
import Logs from "./pages/dashboard/Logs";
import Admins from "./pages/dashboard/Admins";
import Profile from "./pages/dashboard/Profile";
import ProtectedRoute from "./components/dashboard/ProtectedRoute";
import AdminOnlyRoute from "./components/dashboard/AdminOnlyRoute";
import PermissionRoute from "./components/dashboard/PermissionRoute";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(11, 13, 23, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#FFFFFF",
                padding: "16px 24px",
                borderRadius: "8px",
                letterSpacing: "0.05em",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#10B981", secondary: "#0B0D17" },
              },
              error: {
                iconTheme: { primary: "#EF4444", secondary: "#FFFFFF" },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="destination" element={<Destination />} />
              <Route path="crew" element={<Crew />} />
              <Route path="technology" element={<Technology />} />
            </Route>
            <Route path="/dashboard">
              <Route path="login" element={<Login />} />
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="destinations" element={<PermissionRoute permission="MANAGE_DESTINATIONS"><Destinations /></PermissionRoute>} />
                <Route path="crew" element={<PermissionRoute permission="MANAGE_CREW"><DashboardCrewPage /></PermissionRoute>} />
                <Route path="technology" element={<PermissionRoute permission="MANAGE_TECHNOLOGY"><DashboardTechnologyPage /></PermissionRoute>} />
                <Route path="logs" element={<AdminOnlyRoute><Logs /></AdminOnlyRoute>} />
                <Route path="admins" element={<AdminOnlyRoute><Admins /></AdminOnlyRoute>} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
