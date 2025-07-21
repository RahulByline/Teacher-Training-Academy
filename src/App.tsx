import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { UsersDashboard } from './components/dashboards/admin/UsersDashboard';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import SchoolsPage from './pages/SchoolsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/Toaster';
import './i18n';
import AddCategoryPage from './pages/AddCategoryPage';
import { SchoolManagementRoutes } from './components/routes/SchoolManagementRoutes';
import { CourseCategoryRoutes } from './components/routes/CourseCategoryRoutes';
import TrainerDashboardRoutes from './components/routes/TrainerDashboardRoutes';
import { useAuth } from './context/AuthContext';
import TeacherDashboardRoutes from './components/routes/TeacherDashboardRoutes';
import SchoolAdminDashboardPage from './components/pages/courses/SchoolAdminDashboardPage';
import ClusterDashboard from './components/dashboards/clusterDashboard';
 
function DashboardRouteWrapper() {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner if you want
  if (!user) return <Navigate to="/login/trainer" replace />;
  
  // Route teachers to the new TeacherDashboardRoutes
  if (user.role === 'teacher') {
    return <TeacherDashboardRoutes />;
  }
  
  // Route trainers to their specific dashboard
  if (user.role === 'trainer') {
    return <TrainerDashboardRoutes />;
  }
  
  // For other roles, use the old DashboardPage system
  return <DashboardPage />;
}
 
function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login/:role" element={<LoginPage />} />
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <DashboardRouteWrapper />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <CoursesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id"
                  element={
                    <ProtectedRoute>
                      <CourseDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/schools123"
                  element={
                    <ProtectedRoute>
                      <SchoolsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
               
                <Route
                  path="/add-category"
                  element={
                    <ProtectedRoute>
                      <AddCategoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/school/*"
                  element={
                    <ProtectedRoute>
                      <SchoolManagementRoutes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses-categories/*"
                  element={
                    <ProtectedRoute>
                      <CourseCategoryRoutes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <UsersDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher-dashboard/*"
                  element={
                    <ProtectedRoute>
                      <TeacherDashboardRoutes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/school-admin-dashboard"
                  element={
                    <ProtectedRoute>
                      <SchoolAdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clusterdashboard"
                  element={
                    <ProtectedRoute>
                      <ClusterDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
 
export default App;