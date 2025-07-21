import React, { useEffect, useState } from 'react';
import { usersService } from '../../../services/usersService';
import { coursesService } from '../../../services/coursesService';
import { Button } from '../../ui/Button';
import { motion } from 'framer-motion';
import { ChevronLeft, User, BookOpen, Loader2, CheckCircle, UserPlus, ChevronDown } from 'lucide-react';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  username?: string;
}

interface Course {
  id: string;
  fullname: string;
}

interface AssignCourseToUsersProps {
  companyId: number;
  onBack?: () => void;
}

export const AssignCourseToUsers: React.FC<AssignCourseToUsersProps> = ({ companyId, onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<{ [courseId: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<{ [key: string]: boolean }>({});
  const [activeCourse, setActiveCourse] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      usersService.getCompanyUsers(companyId),
      coursesService.getCompanyCourses(companyId)
    ]).then(async ([users, courses]) => {
      setUsers(users);
      setCourses(courses);
      // Fetch enrollments for each course
      const enrollmentsObj: { [courseId: string]: string[] } = {};
      for (const course of courses) {
        const enrolled = await coursesService.getCourseEnrollments(course.id);
        enrollmentsObj[course.id] = enrolled.map((u: any) => u.id?.toString() || u.userid?.toString());
      }
      setEnrollments(enrollmentsObj);
      if (courses.length > 0) setActiveCourse(courses[0].id);
    }).finally(() => setLoading(false));
  }, [companyId]);

  const handleAssign = async (courseId: string, userId: string) => {
    setAssigning(prev => ({ ...prev, [courseId + '-' + userId]: true }));
    await coursesService.enrollUserInCourse(courseId, userId);
    // Refresh enrollments for this course
    const enrolled = await coursesService.getCourseEnrollments(courseId);
    setEnrollments(prev => ({ ...prev, [courseId]: enrolled.map((u: any) => u.id?.toString() || u.userid?.toString()) }));
    setAssigning(prev => ({ ...prev, [courseId + '-' + userId]: false }));
  };

  const getAssignedUsers = (courseId: string) =>
    users.filter(u => enrollments[courseId]?.includes(u.id));
  const getUnassignedUsers = (courseId: string) =>
    users.filter(u => !enrollments[courseId]?.includes(u.id));

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <span className="text-xl text-gray-700">Loading Course Assignments...</span>
      <p className="text-gray-500 mt-2">Fetching users and courses, please wait.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4 hover:bg-gray-100 p-2 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span>User Course Enrollment</span>
        </h2>
      </div>

      <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <label htmlFor="course-select" className="block text-lg font-semibold text-gray-800 mb-2">
            Select a Course
          </label>
          <p className="text-gray-500 mb-4">Choose a course from the list below to manage its user enrollments.</p>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
                id="course-select"
                value={activeCourse || ''}
                onChange={(e) => setActiveCourse(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-gray-50 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
                <option value="" disabled>-- Select a Course --</option>
                {courses.map(course => (
                    <option key={course.id} value={course.id}>
                        {course.fullname}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
      </div>
      
      {activeCourse ? (
        <motion.div
          key={activeCourse}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-6 pb-4 border-b border-gray-200">
            Managing: {courses.find(c => c.id === activeCourse)?.fullname}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Unassigned Users */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white p-4 border-b flex items-center gap-3">
                <UserPlus className="w-6 h-6 text-blue-500" /> Unassigned Users
              </h4>
              <div className="p-4">
                {getUnassignedUsers(activeCourse).length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p className="font-semibold">All users are assigned!</p>
                  </div>
                ) : (
                  <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {getUnassignedUsers(activeCourse).map(user => (
                        <li key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div>
                            <p className="font-semibold text-gray-900">{user.firstname} {user.lastname}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <Button
                              size="sm"
                              variant="primary"
                              loading={assigning[activeCourse + '-' + user.id]}
                              onClick={() => handleAssign(activeCourse, user.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Assign
                          </Button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Assigned Users */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border">
               <h4 className="text-lg font-semibold text-gray-800 dark:text-white p-4 border-b flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" /> Assigned Users
              </h4>
              <div className="p-4">
                {getAssignedUsers(activeCourse).length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No users assigned to this course yet.</p>
                  </div>
                ) : (
                  <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {getAssignedUsers(activeCourse).map(user => (
                        <li key={user.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-green-800">{user.firstname} {user.lastname}</p>
                            <p className="text-sm text-green-700">{user.email}</p>
                          </div>
                           <CheckCircle className="w-6 h-6 text-green-500" />
                        </li>
                      ))}
                   </ul>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg border">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Please select a course</h3>
            <p className="text-gray-500 mt-2">Once you select a course, you can manage user enrollments here.</p>
        </div>
      )}
    </div>
  );
}; 