import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { LoadingSpinner } from '../../LoadingSpinner';
import { schoolsService } from '../../../services/schoolsService';
import { toast } from '../../ui/Toaster';

export const EditSchoolPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Load school data for editing
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading school data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/add-school')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Schools
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {id ? 'Edit School' : 'View School'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {id ? 'Modify school information' : 'View school details'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-300">
          Edit school functionality will be implemented here.
          School ID: {id || 'New'}
        </p>
      </div>
    </div>
  );
};