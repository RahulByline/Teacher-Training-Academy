import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Users, Search, Filter } from 'lucide-react';
import { Course } from '../../types';
 
const mockTrainees = [
  { id: '1', name: 'Alice Johnson', email: 'alice.johnson@company.com', avatar: '/public/avatar1.png', courses: 3, progress: 85, lastActive: '2 hours ago', status: 'active' },
  { id: '2', name: 'Bob Smith', email: 'bob.smith@company.com', avatar: '/public/avatar2.png', courses: 2, progress: 45, lastActive: '1 day ago', status: 'at-risk' },
  { id: '3', name: 'Carol Davis', email: 'carol.davis@company.com', avatar: '/public/avatar3.png', courses: 4, progress: 92, lastActive: '30 minutes ago', status: 'active' },
];
 
export default function TraineesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [trainees, setTrainees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    async function fetchTrainees() {
      if (user && user.id) {
        setLoading(true);
        setError(null);
        try {
          const userCourses = await apiService.getUserCourses(user.id);
          setCourses(userCourses);
          // Fetch enrolled users for each course (flattened, unique by email)
          const allEnrollments = await Promise.all(
            userCourses.map((c) => apiService.getCourseEnrollments?.(String(c.id)))
          );
          const flat = allEnrollments.flat().filter(Boolean);
          // Unique by email
          const unique = Array.from(new Map(flat.map((t: any) => [t.email, t])).values());
          setTrainees(unique);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch trainees');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchTrainees();
  }, [user && user.id]);
 
  const traineesToShow = trainees.length ? trainees : mockTrainees;
 
  return (
    <div className="flex flex-col w-full h-full min-h-screen min-w-screen bg-[#f9fafb] p-8">
      {/* <h1 className="text-2xl font-bold mb-6">My Trainees</h1> */}
      <div className="bg-white rounded-2xl shadow-md p-6 w-full h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-blue-600"><Search className="w-4 h-4" /></button>
            <button className="p-2 text-gray-600 hover:text-blue-600"><Filter className="w-4 h-4" /></button>
          </div>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid gap-4">
            {traineesToShow.map((trainee) => (
              <div key={trainee.email || trainee.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={trainee.avatar || '/public/avatar1.png'} alt={trainee.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{trainee.name || trainee.fullname}</h4>
                      <p className="text-sm text-gray-600">{trainee.email}</p>
                      <p className="text-xs text-gray-500">Last active: {trainee.lastActive || '-'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Courses: </span>
                        <span className="font-medium">{trainee.courses || '-'}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Progress: </span>
                        <span className="font-medium">{trainee.progress || '-'}%</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      trainee.status === 'active' ? 'bg-green-100 text-green-800' :
                      trainee.status === 'at-risk' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {trainee.status || 'active'}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${
                      trainee.status === 'active' ? 'bg-green-500' :
                      trainee.status === 'at-risk' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} style={{ width: `${trainee.progress || 0}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 