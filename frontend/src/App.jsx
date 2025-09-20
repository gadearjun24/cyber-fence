import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import DashboardPage from "./pages/user/DashboardPage/DashboardPage";
import HistoryPage from "./pages/common/HistoryPage/HistoryPage";
import Notifications from "./pages/common/Notifications/Notifications";
import UserProfile from "./pages/common/UserProfile/UserProfile";
import LoginPage from "./pages/common/Auth/LoginPage";
import RegisterPage from "./pages/common/Auth/RegisterPage";
import { useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext"; // ✅ import
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import UserManagement from "./pages/admin/UserManagement/UserManagement";

function App() {
  const { user, userLoading } = useAuth();

  console.log({ user });
  if (userLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect guest users */}
        {!user && <Route path="/" element={<Navigate to="/login" />} />}

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User routes */}
        {user?.role === "user" && (
          <Route
            path="/"
            element={
              <SocketProvider user={user}>
                <Layout type="user" />
              </SocketProvider>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        )}

        {/* Admin routes */}
        {user?.role === "admin" && (
          <Route
            path="/"
            element={
              <SocketProvider user={user}>
                <Layout type="admin" />
              </SocketProvider>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="user-files-history" element={<HistoryPage />} />
            <Route path="manage-users" element={<UserManagement />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        )}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
