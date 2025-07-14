import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { TeacherDashboard } from './dashboards/TeacherDashboard';
import { TrainerDashboard } from './dashboards/TrainerDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { LoadingSpinner } from './LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'teacher':
        return <TeacherDashboard />;
      case 'trainer':
        return <TrainerDashboard />;
      case 'principal':
      case 'cluster_lead':
      case 'admin':
        return <AdminDashboard />;
      default:
        return <TeacherDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};