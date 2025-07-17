import React, { useEffect, useState } from 'react';
import { coursesService } from '../../../services/coursesService';

interface SchoolAdminDashboardProps {
  companyId: number;
}

export const SchoolAdminDashboard: React.FC<SchoolAdminDashboardProps> = ({ companyId }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    coursesService.getCompanyCourses(companyId)
      .then(setCourses)
      .finally(() => setLoading(false));
  }, [companyId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Assigned Courses for Your School</h2>
      {loading ? <p>Loading...</p> : (
        <ul className="space-y-2">
          {courses.length === 0 && <li>No courses assigned to your school.</li>}
          {courses.map(course => (
            <li key={course.id} className="p-2 border rounded-lg bg-white dark:bg-gray-800">
              {course.fullname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 