import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { Button } from '../../ui/Button';

export const AssignCourseGroupsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/courses-categories')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Courses & Categories
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Assign Course Groups
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Assign courses to specific user groups
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Group Assignment
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Course group assignment functionality will be implemented here.
        </p>
      </div>
    </div>
  );
};