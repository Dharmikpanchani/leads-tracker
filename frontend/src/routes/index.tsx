import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import AppLayout from '../components/layout/AppLayout';
import PageLoader from '../components/common/PageLoader';

// Lazy load route components
const Login = lazy(() => import('../pages/Login'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const ForgotPasswordOtp = lazy(() => import('../pages/Auth/ForgotPasswordOtp'));
const SetPassword = lazy(() => import('../pages/Auth/SetPassword'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const LeadsList = lazy(() => import('../pages/Leads/LeadsList'));
const LeadDetail = lazy(() => import('../pages/Leads/LeadDetail'));
const BatchCreateLeads = lazy(() => import('../pages/Leads/BatchCreateLeads'));
const Profile = lazy(() => import('../pages/profile/Profile'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/otp" element={<ForgotPasswordOtp />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* Protected App Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/leads" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<LeadsList />} />
          <Route path="leads/batch" element={<BatchCreateLeads />} />
          <Route path="leads/:id" element={<LeadDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/leads" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
