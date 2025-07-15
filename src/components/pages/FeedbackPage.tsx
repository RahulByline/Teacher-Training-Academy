import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const mockFeedback = [
  { name: 'Mohammed Al-Ghamdi', course: 'Digital Assessment Course', rating: 5.0, text: 'Excellent session! Sarah\'s teaching style made complex assessment techniques very approachable. I can\'t wait to implement these in my classroom.', date: 'May 6, 2025', avatar: '/public/avatar1.png' },
  { name: 'Aisha Al-Sulaiman', course: 'Classroom Management', rating: 4.5, text: 'The strategies shared were practical and immediately applicable. Would appreciate more time for group activities in future sessions.', date: 'May 4, 2025', avatar: '/public/avatar2.png' },
  { name: 'Khalid Al-Harbi', course: 'Digital Learning Basics', rating: 5.0, text: 'As someone who was intimidated by technology, this course was a game-changer. Sarah\'s patient approach helped me gain confidence quickly.', date: 'May 2, 2025', avatar: '/public/avatar3.png' },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeedback() {
      if (user && user.id) {
        setLoading(true);
        setError(null);
        try {
          // Fetch courses for the trainer
          const userCourses = await apiService.getUserCourses(user.id);
          // For each course, try to fetch feedback (no real API, so mock from course data)
          // If you have a real API for feedback, replace this logic
          const realFeedback = userCourses.map((course: any, i: number) => ({
            name: course.instructor || user.fullname || user.username || 'Trainee',
            course: course.fullname,
            rating: course.rating || Math.floor(Math.random() * 2 + 4) + Math.random(),
            text: 'Great course! Learned a lot and enjoyed the interactive sessions.',
            date: course.enddate
              ? new Date(course.enddate * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'N/A',
            avatar: course.instructorAvatar || user.profileimageurl || '/public/avatar1.png',
          }));
          setFeedback(realFeedback.length ? realFeedback : []);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch feedback');
        } finally {
          setLoading(false);
        }
      }
    }
    fetchFeedback();
  }, [user && user.id]);

  const feedbackToShow = feedback.length ? feedback : mockFeedback;

  return (
    <div className="flex flex-col w-full h-full bg-[#f9fafb] p-8">
      <h1 className="text-2xl font-bold mb-6">Feedback</h1>
      <div className="bg-white rounded-2xl shadow-md p-6 w-full">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {feedbackToShow.map((fb, i) => (
              <li key={fb.name + fb.course + i} className="py-3 flex flex-col md:flex-row md:items-center md:gap-4">
                <img src={fb.avatar} alt={fb.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <span className="font-semibold text-gray-800">{fb.name}</span>
                  <span className="flex items-center gap-1 text-yellow-500 font-medium ml-2">★ {Number(fb.rating).toFixed(1)}</span>
                  <span className="text-gray-500 text-sm ml-2">{fb.text}</span>
                  <span className="text-gray-400 text-xs ml-auto">{fb.date}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 text-sm text-gray-700">Overall Rating: <span className="font-bold">4.8</span> from 124 reviews</div>
      </div>
    </div>
  );
} 