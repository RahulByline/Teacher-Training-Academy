import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { schoolsService } from '../../../services/schoolsService';
import { School } from '../../../types';
import { Pencil } from 'lucide-react';
import { LoadingSpinner } from '../../LoadingSpinner';
 
const SchoolListPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const allSchools = await schoolsService.getAllSchools();
        setSchools(allSchools);
      } catch (error) {
        // Optionally handle error
      }
      setLoading(false);
    };
    fetchSchools();
  }, []);
 
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading schools...</span>
      </div>
    );
  }
 
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Schools/Companies</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Short Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{school.name}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{school.shortname}</td>
                <td className="px-4 py-2">
                  <button
                    className="inline-flex items-center px-2 py-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 focus:outline-none"
                    title="Edit"
                    onClick={() => navigate(`/school/edit/${school.id}`)}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
export default SchoolListPage;
 