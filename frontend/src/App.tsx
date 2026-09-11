import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';

import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { LogisticsView } from './pages/LogisticsView';
import { LoginPage } from './pages/auth/LoginPage';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { FPODashboard } from './pages/fpo/FPODashboard';
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/logistics" element={<LogisticsView />} />
            </Route>

            {/* Auth Layout Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Role-Based Dashboard Layout Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/fpo/dashboard" element={<FPODashboard />} />
              <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
