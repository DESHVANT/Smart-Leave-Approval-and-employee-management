
import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import EmployeeLeaveHistoryPage from './pages/EmployeeLeaveHistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import Shell from './components/Shell';

function AppRoutes() {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard'} replace /> : <LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard'} replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="ROLE_EMPLOYEE">
            <Shell>
              <EmployeeDashboardPage />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/leaves"
        element={
          <ProtectedRoute role="ROLE_EMPLOYEE">
            <Shell>
              <EmployeeLeaveHistoryPage />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ROLE_ADMIN">
            <Shell>
              <AdminDashboardPage />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute role="ROLE_ADMIN">
            <Shell>
              <AdminDashboardPage />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leaves"
        element={
          <ProtectedRoute role="ROLE_ADMIN">
            <Shell>
              <AdminDashboardPage />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}