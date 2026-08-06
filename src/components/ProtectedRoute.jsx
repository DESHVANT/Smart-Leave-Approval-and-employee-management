import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { ready, isAuthenticated, user } = useContext(AuthContext);

  if (!ready) {
    return <div className="min-h-screen grid place-items-center text-slate-300">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}