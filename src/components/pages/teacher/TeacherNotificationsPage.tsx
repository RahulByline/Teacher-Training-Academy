import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { Calendar, BookOpen, Users, Award, Video, Bell, CheckCircle, AlertCircle } from 'lucide-react';

const getEventIcon = (type: string) => {
  switch (type) {
    case 'assessment':
      return <Calendar className="w-6 h-6 text-red-500" />;
    case 'workshop':
      return <Video className="w-6 h-6 text-blue-500" />;
    case 'collaboration':
      return <Users className="w-6 h-6 text-purple-500" />;
    case 'exam':
      return <Award className="w-6 h-6 text-green-500" />;
    case 'course_start':
      return <BookOpen className="w-6 h-6 text-indigo-500" />;
    default:
      return <Calendar className="w-6 h-6 text-gray-400" />;
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-6 h-6 text-red-500" />;
    default:
      return <Bell className="w-6 h-6 text-blue-500" />;
  }
};

const TeacherNotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'notifications' | 'events'>('notifications');
  const [events, setEvents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const [realEvents, realNotifications] = await Promise.all([
          apiService.getUserEvents(user.id),
          apiService.getUserNotifications ? apiService.getUserNotifications(user.id) : Promise.resolve([])
        ]);
        setEvents(Array.isArray(realEvents) ? realEvents : []);
        setNotifications(Array.isArray(realNotifications) ? realNotifications : []);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [user?.id]);

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col items-center justify-start py-12 px-2 md:px-8">
      <div className="w-full px-4">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-10 h-10 text-indigo-500" />
          <h1 className="text-3xl font-bold text-gray-900">Notifications & Events</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
          <div className="flex gap-2 mb-6">
            <button onClick={() => setTab('notifications')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${tab === 'notifications' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'}`}>Notifications</button>
            <button onClick={() => setTab('events')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${tab === 'events' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50'}`}>Upcoming Events</button>
          </div>
          {loading ? (
            <div className="text-center text-gray-500 py-16 text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-16 text-lg">{error}</div>
          ) : (
            <div className="space-y-6">
              {tab === 'notifications' ? (
                notifications.length === 0 ? (
                  <div className="text-gray-500">No notifications found.</div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={idx} className="bg-indigo-50 border border-indigo-100 rounded-2xl shadow p-6 flex gap-4 items-center hover:shadow-xl transition-all">
                      <div>{getNotificationIcon(notif.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-lg">{notif.title}</span>
                          {notif.date && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded ml-2">{notif.date}</span>}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{notif.desc}</div>
                        <div className="text-xs text-gray-400">Type: {notif.type || 'N/A'}</div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                events.length === 0 ? (
                  <div className="text-gray-500">No upcoming events found.</div>
                ) : (
                  events.map((event, idx) => (
                    <div key={idx} className="bg-indigo-50 border border-indigo-100 rounded-2xl shadow p-6 flex gap-4 items-center hover:shadow-xl transition-all">
                      <div>{getEventIcon(event.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-lg">{event.title}</span>
                          {event.date && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded ml-2">{event.date}</span>}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{event.desc}</div>
                        <div className="text-xs text-gray-400">Type: {event.type || 'N/A'}</div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherNotificationsPage; 