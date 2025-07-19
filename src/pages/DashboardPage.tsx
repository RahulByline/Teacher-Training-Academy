import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';

import { TrainerDashboard } from '../components/dashboards/TrainerDashboard';
import SchoolAdminDashboardPage from '../components/pages/courses/SchoolAdminDashboardPage';
import { schoolsService } from '../services/schoolsService';
import { usersService } from '../services/usersService';
import { Navigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanyId = async () => {
      if (user?.role === 'school_admin' && user?.id) {
        setLoading(true);
        try {
          // Fetch all companies and find the one where the user is an admin
          const companies = await schoolsService.getAllSchools();
          // Try to find a company where the user is the admin (by username or id)
          // This logic may need to be adjusted based on your data model
          let foundCompany = null;
          for (const company of companies) {
            // Fetch users for this company
            const users = await usersService.getCompanyUsers(company.id);
            // Check if the logged-in user is in the list (by id or username)
            if (users.some(u => u.id === user.id || u.username === user.username)) {
              foundCompany = company;
              break;
            }
          }
          if (foundCompany) {
            setCompanyId(foundCompany.id);
          }
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCompanyId();
  }, [user]);

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'school_admin':
        if (loading || !companyId) return <div>Loading school dashboard...</div>;
        return <SchoolAdminDashboardPage />;
      case 'trainer':
        return <TrainerDashboard />;
      default:
        // For teachers, redirect to the new teacher dashboard
        return <Navigate to="/teacher-dashboard" replace />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};