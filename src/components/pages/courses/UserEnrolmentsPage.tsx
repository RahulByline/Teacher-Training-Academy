import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Search, Filter, Download, UserPlus } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { LoadingSpinner } from '../../LoadingSpinner';
import { coursesService } from '../../../services/coursesService';

export const UserEnrolmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      setEnrollments([
        { id: 1, userName: 'John Doe', courseName: 'Advanced Teaching', status: 'Active', progress: 75 },
        { id: 2, userName: 'Jane Smith', courseName: 'Leadership Skills', status: 'Completed', progress: 100 },
        { id: 3, userName: 'Mike Johnson', courseName: 'Assessment Methods', status: 'In Progress', progress: 45 }
      ]);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

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
              User Enrollments
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage student enrollments and track progress
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button>
            <UserPlus className="w-4 h-4" />
            Enroll User
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Enrollment Management
          </h2>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search enrollments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Course</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Progress</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment: any) => (
                  <tr key={enrollment.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{enrollment.userName}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{enrollment.courseName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        enrollment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        enrollment.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};