import React, { useEffect, useState } from 'react';
import { coursesService } from '../../../services/coursesService';
import { apiService } from '../../../services/api';

interface SchoolAdminDashboardProps {
  companyId: number;
}

export const SchoolAdminDashboard: React.FC<SchoolAdminDashboardProps> = ({ companyId }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<{ [courseId: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState<{ [courseId: string]: any }>({});
  const [assigning, setAssigning] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setLoading(true);
    Promise.all([
      coursesService.getCompanyCourses(companyId),
      apiService.getAllUsers()
    ])
      .then(async ([courses, allUsers]) => {
        setCourses(courses);
        const companyUsers = allUsers.filter((u: any) => u.companyid == companyId || u.companyid === String(companyId));
        setUsers(companyUsers);
        // Fetch enrollments and license info for each course
        const enrollmentsObj: { [courseId: string]: string[] } = {};
        const licenseObj: { [courseId: string]: any } = {};
        for (const course of courses) {
          const enrolled = await coursesService.getCourseEnrollments(course.id);
          enrollmentsObj[course.id] = enrolled.map((e: any) => e.userid || e.id);
          // Fetch license info
          try {
            const lic = await coursesService.getCourseLicenseInfo(companyId, course.id);
            licenseObj[course.id] = lic;
          } catch (e) {
            licenseObj[course.id] = null;
          }
        }
        setEnrollments(enrollmentsObj);
        setLicenseInfo(licenseObj);
      })
      .finally(() => setLoading(false));
  }, [companyId]);

  // Assign user to course
  const handleAssign = async (courseId: string, userId: string) => {
    setAssigning(prev => ({ ...prev, [courseId + '-' + userId]: true }));
    await coursesService.enrollUserInCourse(courseId, userId);
    // Refresh enrollments for this course
    const enrolled = await coursesService.getCourseEnrollments(courseId);
    setEnrollments(prev => ({ ...prev, [courseId]: enrolled.map((e: any) => e.userid || e.id) }));
    setAssigning(prev => ({ ...prev, [courseId + '-' + userId]: false }));
  };

  // Helper to get license stats
  const getLicenseStats = (courseId: string) => {
    const lic = licenseInfo[courseId];
    if (!lic || !lic.licenses || !Array.isArray(lic.licenses) || lic.licenses.length === 0) return null;
    // Assume first license is the relevant one
    const license = lic.licenses[0];
    const total = parseInt(license.allocation || license.total || '0', 10);
    const used = parseInt(license.used || '0', 10);
    return { total, used };
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Assigned Courses for Your School</h2>
      {loading ? <p>Loading...</p> : (
        <div>
          {courses.length === 0 && <p>No courses assigned to your school.</p>}
          {courses.map(course => {
            const stats = getLicenseStats(course.id);
            return (
              <div key={course.id} className="mb-6 p-4 border rounded-lg bg-white dark:bg-gray-800">
                <h3 className="font-semibold text-lg mb-2">{course.fullname}</h3>
                {stats && (
                  <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                    License usage: {stats.used} / {stats.total}
                  </div>
                )}
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">User</th>
                      <th className="text-left">Email</th>
                      <th className="text-left">Enrolled</th>
                      <th className="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => {
                      const isEnrolled = enrollments[course.id]?.includes(user.id);
                      const canAssign = stats ? stats.used < stats.total : true;
                      return (
                        <tr key={user.id} className={isEnrolled ? 'bg-green-50' : ''}>
                          <td>{user.fullname}</td>
                          <td>{user.email}</td>
                          <td>{isEnrolled ? 'Yes' : 'No'}</td>
                          <td>
                            {!isEnrolled && (
                              <button
                                className="px-2 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                                disabled={!canAssign || assigning[course.id + '-' + user.id]}
                                onClick={() => handleAssign(course.id, user.id)}
                              >
                                {assigning[course.id + '-' + user.id] ? 'Assigning...' : 'Assign'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}; 