import React, { useEffect, useState } from 'react';
import { usersService } from '../../../services/usersService';
import { coursesService } from '../../../services/coursesService';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
}

interface Course {
  id: string;
  fullname: string;
}

interface SchoolAdminDashboardProps {
  companyId: number;
}

export const SchoolAdminDashboard: React.FC<SchoolAdminDashboardProps> = ({ companyId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<{ [courseId: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<{ [key: string]: boolean }>({});

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">School Users & Course Assignment</h2>
      {courses.length === 0 && <p>No courses assigned to your school.</p>}
      {courses.map(course => (
        <div key={course.id} className="mb-8 p-4 border rounded-lg bg-white dark:bg-gray-800">
          <h3 className="font-semibold text-lg mb-2">{course.fullname}</h3>
          <div className="mb-2 font-semibold">Assigned Users</div>
          <table className="min-w-full text-sm mb-4">
            <thead>
              <tr>
                <th className="text-left">User</th>
                <th className="text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {getAssignedUsers(course.id).map(user => (
                <tr key={user.id}>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
              {getAssignedUsers(course.id).length === 0 && (
                <tr><td colSpan={2}>No users assigned to this course.</td></tr>
              )}
            </tbody>
          </table>
          <div className="mb-2 font-semibold">Unassigned Users</div>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">User</th>
                <th className="text-left">Email</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {getUnassignedUsers(course.id).map(user => (
                <tr key={user.id}>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="px-2 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                      disabled={assigning[course.id + '-' + user.id]}
                      onClick={() => handleAssign(course.id, user.id)}
                    >
                      {assigning[course.id + '-' + user.id] ? 'Assigning...' : 'Assign'}
                    </button>
                  </td>
                </tr>
              ))}
              {getUnassignedUsers(course.id).length === 0 && (
                <tr><td colSpan={3}>All users assigned to this course.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}; 