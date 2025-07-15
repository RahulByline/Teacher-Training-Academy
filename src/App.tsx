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

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login/:role" element={<LoginPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
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