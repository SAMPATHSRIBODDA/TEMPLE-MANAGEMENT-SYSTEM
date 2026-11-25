import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { Dashboard } from './screens/Dashboard';
import { Settings } from './screens/settings/Settings';
import { Splash } from './screens/auth/Splash';
import { Login } from './screens/auth/Login';
import { ForgotPassword } from './screens/auth/ForgotPassword';
import { VerifyOTP } from './screens/auth/VerifyOTP';
import { ResetPassword } from './screens/auth/ResetPassword';
import { TemplesList } from './screens/temples/TemplesList';
import { TempleForm } from './screens/temples/TempleForm';
import { TempleDetails } from './screens/temples/TempleDetails';
import { SubscriptionsHub } from './screens/subscriptions/SubscriptionsHub';
import { PlanForm } from './screens/subscriptions/PlanForm';
import { ManageSubscription } from './screens/subscriptions/ManageSubscription';
import { RevenueDashboard } from './screens/revenue/RevenueDashboard';
import { AppManagementHub } from './screens/apps/AppManagementHub';
import { WhiteLabelHub } from './screens/whitelabel/WhiteLabelHub';
import { SystemHealthHub } from './screens/support/SystemHealthHub';
import { SuperAdminSettings } from './screens/settings/SuperAdminSettings';
import { DevoteesList } from './screens/devotees/DevoteesList';
import { DevoteeForm } from './screens/devotees/DevoteeForm';
import { DonationsList } from './screens/donations/DonationsList';
import { DonationForm } from './screens/donations/DonationForm';
import { PujasList } from './screens/pujas/PujasList';
import { PujaForm } from './screens/pujas/PujaForm';
import { InventoryList } from './screens/inventory/InventoryList';
import { InventoryForm } from './screens/inventory/InventoryForm';
import { StaffList } from './screens/staff/StaffList';
import { StaffForm } from './screens/staff/StaffForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/temples" element={<TemplesList />} />
          <Route path="/temples/new" element={<TempleForm />} />
          <Route path="/temples/:id" element={<TempleDetails />} />
          <Route path="/temples/:id/edit" element={<TempleForm />} />
          <Route path="/devotees" element={<DevoteesList />} />
          <Route path="/devotees/new" element={<DevoteeForm />} />
          <Route path="/devotees/:id/edit" element={<DevoteeForm />} />
          <Route path="/donations" element={<DonationsList />} />
          <Route path="/donations/new" element={<DonationForm />} />
          <Route path="/pujas" element={<PujasList />} />
          <Route path="/pujas/new" element={<PujaForm />} />
          <Route path="/pujas/:id/edit" element={<PujaForm />} />
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/inventory/new" element={<InventoryForm />} />
          <Route path="/inventory/:id/edit" element={<InventoryForm />} />
          <Route path="/staff" element={<StaffList />} />
          <Route path="/staff/new" element={<StaffForm />} />
          <Route path="/staff/:id/edit" element={<StaffForm />} />
          <Route path="/apps" element={<AppManagementHub />} />
          <Route path="/white-label" element={<WhiteLabelHub />} />
          <Route path="/subscriptions" element={<SubscriptionsHub />} />
          <Route path="/subscriptions/plans/new" element={<PlanForm />} />
          <Route path="/subscriptions/plans/:id/edit" element={<PlanForm />} />
          <Route path="/subscriptions/:id/manage" element={<ManageSubscription />} />
          <Route path="/revenue" element={<RevenueDashboard />} />
          <Route path="/support" element={<SystemHealthHub />} />
          <Route path="/settings" element={<SuperAdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
