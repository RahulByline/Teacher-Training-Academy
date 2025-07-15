import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const mockAssessments = [
  { title: 'Digital Assessment Quiz', score: 95, date: 'May 6, 2025' },
  { title: 'Classroom Management Test', score: 88, date: 'May 4, 2025' },
  { title: 'Mentoring Skills Survey', score: 92, date: 'May 2, 2025' },
];

export default function AssessmentsPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssessments() {
      if (user && user.id) {
        setLoading(true);
        setError(null);
        try {
          // Fetch courses for the trainer
          const userCourses = await apiService.getUserCourses(user.id);
          // For each course, try to fetch assessments (mocked: use course name as assessment)
          // If you have a real API for assessments, replace this logic
          const realAssessments = userCourses.map((course: any) => ({
            title: course.fullname + ' Assessment',
            score: course.progress || Math.floor(Math.random() * 40 + 60),
            date: course.enddate
              ? new Date(course.enddate * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'N/A',
          }));
          setAssessments(realAssessments.length ? realAssessments : []);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch assessments');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchAssessments();
  }, [user && user.id]);

  const assessmentsToShow = assessments.length ? assessments : mockAssessments;

  return (
    <div className="flex flex-col w-full h-full min-h-screen min-w-screen bg-[#f9fafb] p-8">
      <h1 className="text-2xl font-bold mb-6">Assessments</h1>
      <div className="bg-white rounded-2xl shadow-md p-6 w-full h-full">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th className="py-2 pr-4">Assessment</th>
                <th className="py-2 pr-4">Score</th>
                <th className="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {assessmentsToShow.map((assessment) => (
                <tr key={assessment.title} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium text-gray-800">{assessment.title}</td>
                  <td className="py-2 pr-4">{assessment.score}%</td>
                  <td className="py-2 pr-4">{assessment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 