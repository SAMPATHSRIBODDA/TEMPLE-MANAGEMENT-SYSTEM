import React from 'react';
import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';
import { usePermissionsStore } from './store/permissionsStore';
import { useSessionTimeout } from './hooks/useSessionTimeout';

// Layouts & Screens
import AuthLayout from './layouts/AuthLayout';
import Login from './screens/auth/Login';
import ForgotPassword from './screens/auth/ForgotPassword';
import OTPVerification from './screens/auth/OTPVerification';
import LockScreen from './screens/auth/LockScreen';

import MainLayout from './layouts/MainLayout';
import Dashboard from './screens/dashboard/Dashboard';
import EntryTicket from './screens/entry/EntryTicket';
import ReceiptHistory from './screens/entry/ReceiptHistory';
import DarshanBooking from './screens/darshan/DarshanBooking';
import DarshanHistory from './screens/darshan/DarshanHistory';
import LadduSales from './screens/laddu/LadduSales';
import LadduHistory from './screens/laddu/LadduHistory';
import GenericSectionPOS from './screens/entry/GenericSectionPOS';
import PoojaPOS from './screens/pooja/PoojaPOS';
import DonationPOS from './screens/donation/DonationPOS';
import PrinterSettings from './screens/settings/PrinterSettings';
import QRScanner from './screens/scanner/QRScanner';
import OnlineBookings from './screens/bookings/OnlineBookings';
import ReportsDashboard from './screens/reports/ReportsDashboard';
import DailyClosing from './screens/accountant/DailyClosing';
import GeneralSettings from './screens/settings/GeneralSettings';
import TicketPricingDashboard from './screens/settings/TicketPricingDashboard';
import SyncStatus from './screens/sync/SyncStatus';
import MastersDashboard from './screens/masters/MastersDashboard';
import StaffDashboard from './screens/staff/StaffDashboard';
import InventoryDashboard from './screens/inventory/InventoryDashboard';
import TransactionsDashboard from './screens/transactions/TransactionsDashboard';
import ExpenseManagement from './screens/accountant/ExpenseManagement';
import AccountantSettings from './screens/accountant/AccountantSettings';
import ShiftManagement from './screens/counter/ShiftManagement';
import AdvancedSettingsDashboard from './screens/admin/AdvancedSettingsDashboard';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLocked } = useAuthStore();
  
  // Initialize session timeout logic for protected routes
  useSessionTimeout();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      {children}
      {isLocked && <LockScreen />}
    </>
  );
};

const RequirePermission = ({ children, perm }: { children: JSX.Element, perm: string }) => {
  const { user } = useAuthStore();
  const { hasPermission } = usePermissionsStore();

  let aclRole = 'Counter Staff';
  if (user?.role === 'Admin') aclRole = 'Temple Admin';
  if (user?.role === 'Accountant') aclRole = 'Accountant';

  if (!hasPermission(aclRole, perm)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { theme } = useSettingsStore();

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp" element={<OTPVerification />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<RequirePermission perm="Dashboard"><Dashboard /></RequirePermission>} />
          {/* Counter Routes */}
          <Route path="/entry" element={<RequirePermission perm="Tickets"><EntryTicket /></RequirePermission>} />
          <Route path="/entry/history" element={<RequirePermission perm="Tickets"><ReceiptHistory /></RequirePermission>} />
          <Route path="/darshan" element={<RequirePermission perm="Poojas"><DarshanBooking /></RequirePermission>} />
          <Route path="/darshan/history" element={<RequirePermission perm="Poojas"><DarshanHistory /></RequirePermission>} />
          <Route path="/laddu" element={<RequirePermission perm="Laddus"><LadduSales /></RequirePermission>} />
          <Route path="/laddu/history" element={<RequirePermission perm="Laddus"><LadduHistory /></RequirePermission>} />
          <Route path="/pooja" element={<RequirePermission perm="Poojas"><PoojaPOS /></RequirePermission>} />
          <Route path="/donations" element={<RequirePermission perm="Donations"><DonationPOS /></RequirePermission>} />
          <Route path="/shift" element={<RequirePermission perm="Tickets"><ShiftManagement /></RequirePermission>} />
          <Route path="/pos/:sectionName" element={<RequirePermission perm="Tickets"><GenericSectionPOS /></RequirePermission>} />
          <Route path="/scanner" element={<RequirePermission perm="Tickets"><QRScanner /></RequirePermission>} />
          <Route path="/online-bookings" element={<RequirePermission perm="Tickets"><OnlineBookings /></RequirePermission>} />
          
          <Route path="/reports" element={<RequirePermission perm="Reports"><ReportsDashboard /></RequirePermission>} />
          <Route path="/reports/closing" element={<RequirePermission perm="Reports"><DailyClosing /></RequirePermission>} />
          <Route path="/transactions" element={<RequirePermission perm="Reports"><TransactionsDashboard /></RequirePermission>} />
          <Route path="/expenses" element={<RequirePermission perm="Reports"><ExpenseManagement /></RequirePermission>} />
          
          <Route path="/inventory" element={<RequirePermission perm="Inventory"><InventoryDashboard /></RequirePermission>} />
          
          <Route path="/settings" element={<RequirePermission perm="Settings"><GeneralSettings /></RequirePermission>} />
          <Route path="/settings/printer" element={<RequirePermission perm="Settings"><PrinterSettings /></RequirePermission>} />
          <Route path="/masters" element={<RequirePermission perm="Settings"><MastersDashboard /></RequirePermission>} />
          <Route path="/pricing" element={<RequirePermission perm="Settings"><TicketPricingDashboard /></RequirePermission>} />
          <Route path="/accountant-settings" element={<RequirePermission perm="Settings"><AccountantSettings /></RequirePermission>} />
          <Route path="/staff" element={<RequirePermission perm="Settings"><StaffDashboard /></RequirePermission>} />
          <Route path="/admin-settings" element={<RequirePermission perm="Settings"><AdvancedSettingsDashboard /></RequirePermission>} />
          
          <Route path="/sync" element={<SyncStatus />} /> {/* Sync status is available globally to anyone logged in */}
        </Route>
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
