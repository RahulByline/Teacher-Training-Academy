import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Course } from '../../types';

const mockSchedule = [
  { day: 'MON', date: 5, events: [{ time: '9:00 - 11:00', title: 'Digital Learning Basics', color: 'bg-blue-100 text-blue-800' }] },
  { day: 'TUE', date: 6, events: [{ time: '13:00 - 15:00', title: 'Assessment Design', color: 'bg-purple-100 text-purple-800' }] },
  { day: 'WED', date: 7, events: [] },
  { day: 'THU', date: 8, events: [
    { time: '10:00 - 12:00', title: 'Classroom Management', color: 'bg-green-100 text-green-800' },
    { time: '14:00 - 16:00', title: 'Mentoring Session', color: 'bg-yellow-100 text-yellow-800' }
  ] },
  { day: 'FRI', date: 9, events: [
    { time: '9:00 - 12:00', title: 'Advanced Digital Assessment', color: 'bg-blue-100 text-blue-800' }
  ] },
  { day: 'SAT', date: 10, events: [
    { time: '11:00 - 13:00', title: 'Trainer Development', color: 'bg-red-100 text-red-800' }
  ] },
  { day: 'SUN', date: 11, events: [] },
];

export default function SchedulePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      setError(null);
      apiService.getUserCourses(user.id)
        .then(setCourses)
        .catch((err) => setError(err.message || 'Failed to fetch courses'))
        .finally(() => setLoading(false));
    }
  }, [user && user.id]);

  // Map real courses to schedule events if available
  const realEvents = useMemo(() => {
    if (!courses.length) return [];
    return courses
      .filter(c => !!c.startdate && !!c.enddate)
      .map(c => {
        const start = new Date((c.startdate ?? 0) * 1000);
        const end = new Date((c.enddate ?? 0) * 1000);
        return {
          day: start.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          date: start.getDate(),
          events: [{
            time: `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            title: c.fullname,
            color: 'bg-blue-100 text-blue-800',
            location: c.format || 'TBD',
            enrolled: c.enrollmentCount || 0
          }]
        };
      });
  }, [courses]);

  // Merge real events into the mock schedule (if any real events exist)
  type ScheduleDay = { day: string; date: number; events: { time: string; title: string; color: string; location: string; enrolled: number }[] };
  const scheduleToShow: ScheduleDay[] = useMemo(() => {
    if (realEvents.length) return realEvents as ScheduleDay[];
    // Patch mock data to always have location and enrolled for type safety
    return mockSchedule.map(day => ({
      ...day,
      events: day.events.map(event => ({
        ...event,
        location: (event as any).location || 'TBD',
        enrolled: typeof (event as any).enrolled === 'number' ? (event as any).enrolled : 0
      }))
    }));
  }, [realEvents]);

  return (
    <div className="flex flex-col w-full h-full min-h-screen min-w-screen bg-[#f9fafb] p-8">
      <h1 className="text-2xl font-bold mb-6">My Schedule</h1>
      <div className="bg-white rounded-2xl shadow-md p-6 w-full h-full">
        <h3 className="text-lg font-bold mb-4 text-gray-900">This Week's Schedule <span className="text-gray-400 font-normal">(May 5–11)</span></h3>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <ol className="relative border-l-2 border-indigo-200 ml-4">
            {scheduleToShow.map((day) => (
              <li key={day.day} className="mb-6 ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full ring-4 ring-white">
                  <span className="text-indigo-500 font-bold">{day.day}</span>
                </span>
                <span className="text-gray-800 font-medium">{day.day}</span>
                <span className="text-gray-500 text-sm ml-2">{day.date}</span>
                <div className="mt-2">
                  {day.events.map((event, eIndex) => (
                    <div key={eIndex} className={`${event.color} p-2 rounded-lg text-sm font-medium flex items-center gap-4`}>
                      <span>{event.time} - {event.title}</span>
                      {event.location && (
                        <span className="flex items-center gap-1 text-xs text-gray-600 ml-4"><MapPin className="w-4 h-4" />{event.location}</span>
                      )}
                      {typeof event.enrolled === 'number' && (
                        <span className="flex items-center gap-1 text-xs text-gray-600 ml-4"><Users className="w-4 h-4" />{event.enrolled} enrolled</span>
                      )}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
} 