import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { Button } from '../../ui/Button';

export const OptionalProfiles: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/school')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Schools
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Optional Profiles
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Configure additional user profile fields
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <UserCheck className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profile Configuration
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Optional profiles functionality will be implemented here.
        </p>
      </div>
    </div>
  );
};