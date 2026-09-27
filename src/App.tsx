import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './auth/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { RoleGuard } from './auth/RoleGuard';
import { AppLayout } from './layouts/AppLayout';

// Core application pages
import { DashboardPage } from './pages/DashboardPage';
import { ProgressPage } from './pages/ProgressPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { ReviewPage } from './pages/ReviewPage';
import { ContradictionsPage } from './pages/ContradictionsPage';
import { TimelinePage } from './pages/TimelinePage';
import { IngestionPage } from './pages/IngestionPage';
import { MemoryPage } from './pages/MemoryPage';
import { CopilotPage } from './pages/CopilotPage';
import { SettingsPage } from './pages/SettingsPage';
import { ReportProgressPage } from './pages/ReportProgressPage';
import { FieldUpdatesPage } from './pages/FieldUpdatesPage';

// Authentication & Identity pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Unauthorized } from './pages/Unauthorized';
import { Profile } from './pages/Profile';
import { Users } from './pages/Users';
import { Roles } from './pages/Roles';
import { AuditLogs } from './pages/AuditLogs';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Enterprise Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />

              <Route
                path="dashboard"
                element={
                  <RoleGuard requiredPermission="VIEW_DASHBOARD">
                    <DashboardPage />
                  </RoleGuard>
                }
              />

              <Route
                path="progress"
                element={
                  <RoleGuard requiredPermission="VIEW_PROGRESS">
                    <ProgressPage />
                  </RoleGuard>
                }
              />

              <Route
                path="activities"
                element={
                  <RoleGuard requiredPermission="VIEW_ACTIVITIES">
                    <ActivitiesPage />
                  </RoleGuard>
                }
              />

              <Route
                path="review"
                element={
                  <RoleGuard requiredPermission="APPROVE_MAPPING">
                    <ReviewPage />
                  </RoleGuard>
                }
              />

              <Route
                path="contradictions"
                element={
                  <RoleGuard requiredPermission="RESOLVE_CONTRADICTION">
                    <ContradictionsPage />
                  </RoleGuard>
                }
              />

              <Route
                path="timeline"
                element={
                  <RoleGuard requiredPermission="VIEW_PROGRESS">
                    <TimelinePage />
                  </RoleGuard>
                }
              />

              <Route
                path="ingestion"
                element={
                  <RoleGuard requiredPermission="UPLOAD_REPORT">
                    <IngestionPage />
                  </RoleGuard>
                }
              />

              <Route
                path="report"
                element={
                  <RoleGuard requiredPermission="UPLOAD_REPORT">
                    <ReportProgressPage />
                  </RoleGuard>
                }
              />

              <Route
                path="incoming"
                element={
                  <RoleGuard requiredPermission="APPROVE_MAPPING">
                    <FieldUpdatesPage />
                  </RoleGuard>
                }
              />

              <Route
                path="memory"
                element={
                  <RoleGuard requiredPermission="VIEW_MEMORY">
                    <MemoryPage />
                  </RoleGuard>
                }
              />

              <Route
                path="copilot"
                element={
                  <RoleGuard requiredPermission="USE_COPILOT">
                    <CopilotPage />
                  </RoleGuard>
                }
              />

              <Route
                path="settings"
                element={
                  <RoleGuard requiredPermission="MANAGE_AI_SETTINGS">
                    <SettingsPage />
                  </RoleGuard>
                }
              />

              <Route path="profile" element={<Profile />} />

              {/* Admin-only RBAC governance & audit routes */}
              <Route
                path="users"
                element={
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <Users />
                  </RoleGuard>
                }
              />

              <Route
                path="users/roles"
                element={
                  <RoleGuard allowedRoles={['ADMIN']}>
                    <Roles />
                  </RoleGuard>
                }
              />

              <Route
                path="audit"
                element={
                  <RoleGuard requiredPermission="VIEW_AUDIT_LOG">
                    <AuditLogs />
                  </RoleGuard>
                }
              />

              {/* 403 Forbidden Access Restricted Page */}
              <Route path="unauthorized" element={<Unauthorized />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
