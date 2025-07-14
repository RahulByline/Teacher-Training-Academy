import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { TeacherDashboard } from '../components/dashboards/TeacherDashboard';
import { TrainerDashboard } from '../components/dashboards/TrainerDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'trainer':
        return <TrainerDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};