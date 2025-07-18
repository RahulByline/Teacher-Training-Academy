import React, { useEffect, useState } from 'react';
import { usersService } from '../../../services/usersService';
import { coursesService } from '../../../services/coursesService';
import { Button } from '../../ui/Button';
import { motion } from 'framer-motion';
import { ChevronLeft, User, BookOpen, Loader2 } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-96">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
      <span className="text-lg text-gray-700">Loading course assignments...</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center mb-6">
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        )}
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" /> Assign Courses to Users
        </h2>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        {courses.map(course => (
          <Button
            key={course.id}
            variant={activeCourse === course.id ? 'primary' : 'outline'}
            size="md"
            onClick={() => setActiveCourse(course.id)}
          >
            {course.fullname}
          </Button>
        ))}
      </div>
      {activeCourse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> {courses.find(c => c.id === activeCourse)?.fullname}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Assigned Users */}
            <div>
              <h4 className="text-lg font-bold text-green-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Assigned Users
              </h4>
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 mb-4 min-h-[120px]">
                {getAssignedUsers(activeCourse).length === 0 ? (
                  <div className="text-gray-500">No users assigned to this course.</div>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">User</th>
                        <th className="text-left">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getAssignedUsers(activeCourse).map(user => (
                        <tr key={user.id}>
                          <td>{user.firstname} {user.lastname}</td>
                          <td>{user.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            {/* Unassigned Users */}
            <div>
              <h4 className="text-lg font-bold text-yellow-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Unassigned Users
              </h4>
              <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 mb-4 min-h-[120px]">
                {getUnassignedUsers(activeCourse).length === 0 ? (
                  <div className="text-gray-500">All users assigned to this course.</div>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">User</th>
                        <th className="text-left">Email</th>
                        <th className="text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getUnassignedUsers(activeCourse).map(user => (
                        <tr key={user.id}>
                          <td>{user.firstname} {user.lastname}</td>
                          <td>{user.email}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="primary"
                              loading={assigning[activeCourse + '-' + user.id]}
                              onClick={() => handleAssign(activeCourse, user.id)}
                            >
                              Assign
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}; 