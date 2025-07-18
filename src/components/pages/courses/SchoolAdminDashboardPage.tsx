import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { schoolsService } from '../../../services/schoolsService';
import { usersService } from '../../../services/usersService';
import { AssignCourseToUsers } from './AssignCourseToUsers';
import { Button } from '../../ui/Button';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const SchoolAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAssign, setShowAssign] = useState(false);

  useEffect(() => {
    const fetchCompanyId = async () => {
      if (user?.role === 'school_admin' && user?.id) {
        setLoading(true);
        setError(null);
        try {
          const companies = await schoolsService.getAllSchools();
          let foundCompany = null;
          for (const company of companies) {
            const users = await usersService.getCompanyUsers(company.id);
            if (users.some(u => u.id === user.id || u.username === user.username)) {
              foundCompany = company;
              break;
            }
          }
          if (foundCompany) {
            setCompanyId(foundCompany.id);
          } else {
            setError('No company found for this school admin.');
          }
        } catch (e) {
          setError('Failed to fetch company info.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCompanyId();
  }, [user]);

  if (loading) return <div className="flex justify-center items-center min-h-96 text-lg">Loading school dashboard...</div>;
  if (error) return <div className="flex justify-center items-center min-h-96 text-red-600 text-lg">{error}</div>;
  if (!companyId) return <div className="flex justify-center items-center min-h-96 text-lg">No company found for this school admin.</div>;

  if (showAssign) {
    return <AssignCourseToUsers companyId={companyId} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center"
      >
        <Users className="w-12 h-12 text-blue-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">School Admin Dashboard</h1>
        <p className="text-gray-600 mb-6 text-center">
          Manage your school's course assignments. Click below to assign courses to users.
        </p>
        <Button variant="primary" size="md" onClick={() => setShowAssign(true)}>
          Assign Courses to Users
        </Button>
      </motion.div>
    </div>
  );
};

export default SchoolAdminDashboardPage; 