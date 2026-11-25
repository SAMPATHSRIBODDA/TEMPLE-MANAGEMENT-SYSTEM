import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import CounterDashboard from './CounterDashboard';
import AccountantDashboard from './AccountantDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Accountant':
      return <AccountantDashboard />;
    case 'Counter':
    default:
      return <CounterDashboard />;
  }
}
