import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Trophy, Star, Users, Award, BookOpen, TrendingUp, CheckCircle, MessageCircle, Award as AwardIcon, Video, Calendar, Clock, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Course } from '../../../types';

const TeacherDashboardMainPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [competency, setCompetency] = useState<any[]>([]);
  const [learningPath, setLearningPath] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const [
          userCourses,
          userAchievements,
          userEvents,
          availableMentors,
          userCompetency,
          userLearningPath,
          userRecentActivity
        ] = await Promise.all([
          apiService.getUserCourses(user.id),
          apiService.getUserAchievements(user.id),
          apiService.getUserEvents(user.id),
          apiService.getAvailableMentors(user.id),
          apiService.getUserCompetency(user.id),
          apiService.getUserLearningPath(user.id),
          apiService.getUserRecentActivity(user.id)
        ]);
        
        setCourses(userCourses);
        setAchievements(userAchievements);
        setEvents(userEvents);
        setMentors(availableMentors);
        setCompetency(userCompetency);
        setLearningPath(userLearningPath);
        setRecentActivity(userRecentActivity);
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);

  // Calculate real data metrics
  const competencyScore = competency.length > 0 
    ? Math.round(competency.reduce((acc, c) => acc + c.value, 0) / competency.length)
    : 0;
  const learningHours = courses.reduce((acc, c) => acc + (c.progress || 0), 0);
  const completedCourses = courses.filter((c) => c.progress === 100).length;
  const totalCourses = courses.length;
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;
  const totalAchievements = achievements.length;

  // Transform competency data for radar chart
  const competencyChartData = competency.map((comp) => ({
    subject: comp.label,
    value: comp.value,
    color: getCompetencyColor(comp.label)
  }));

  // Transform events with icons and colors
  const eventsWithIcons = events.map((event) => {
    const iconAndColor = getEventIconAndColor(event.type);
    return {
      ...event,
      ...iconAndColor
    };
  });

  // Transform mentors with avatars and status colors
  const mentorsWithAvatars = mentors.map((mentor) => ({
    ...mentor,
    avatar: mentor.profileImage || `https://randomuser.me/api/portraits/${mentor.role === 'trainer' ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
    statusColor: getStatusColor(mentor.status)
  }));

  // Transform recent activity with icons
  const activityWithIcons = recentActivity.map((activity) => ({
    ...activity,
    icon: <CheckCircle className="w-6 h-6 text-green-400" />
  }));

  function getCompetencyColor(label: string): string {
    const colors: { [key: string]: string } = {
      'Pedagogy': '#6366f1',
      'Assessment': '#22c55e',
      'Technology': '#ef4444',
      'Management': '#a21caf',
      'Content': '#f59e42'
    };
    return colors[label] || '#6366f1';
  }

  function getEventIconAndColor(type: string) {
    const configs: { [key: string]: any } = {
      'assessment': {
        icon: <Calendar className="w-5 h-5 text-red-500" />,
        color: 'bg-red-50',
        dateColor: 'text-red-500'
      },
      'workshop': {
        icon: <Video className="w-5 h-5 text-blue-500" />,
        color: 'bg-blue-50',
        dateColor: 'text-blue-500'
      },
      'collaboration': {
        icon: <Users className="w-5 h-5 text-purple-500" />,
        color: 'bg-purple-50',
        dateColor: 'text-purple-500'
      },
      'exam': {
        icon: <AwardIcon className="w-5 h-5 text-green-500" />,
        color: 'bg-green-50',
        dateColor: 'text-green-500'
      },
      'course_start': {
        icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
        color: 'bg-indigo-50',
        dateColor: 'text-indigo-500'
      }
    };
    return configs[type] || {
      icon: <Calendar className="w-5 h-5 text-gray-500" />,
      color: 'bg-gray-50',
      dateColor: 'text-gray-500'
    };
  }

  function getStatusColor(status: string): string {
    if (status === 'Online') return 'text-green-500';
    if (status.includes('In')) return 'text-yellow-500';
    if (status === 'Yesterday') return 'text-blue-500';
    return 'text-gray-400';
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">{t('Loading...')}</div>;
  }

  return (
    <div className="w-full h-full p-4 md:p-6 overflow-y-auto bg-[#f9fafb]">
      {/* Top Row: Real Data Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Competency Score */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col justify-between min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium text-sm md:text-base">Competency Score</span>
            <span className="bg-blue-100 p-2 rounded-full"><Globe2 className="w-4 h-4 md:w-5 md:h-5 text-blue-500" /></span>
          </div>
          <div className="text-xl md:text-2xl font-bold mb-1">{competencyScore}/100</div>
        </div>
        {/* Learning Hours */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col justify-between min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium text-sm md:text-base">Learning Hours</span>
            <span className="bg-green-100 p-2 rounded-full"><Clock className="w-4 h-4 md:w-5 md:h-5 text-green-500" /></span>
          </div>
          <div className="text-xl md:text-2xl font-bold mb-1">{learningHours}</div>
        </div>
        {/* Certifications */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col justify-between min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium text-sm md:text-base">Certifications</span>
            <span className="bg-purple-100 p-2 rounded-full"><AwardIcon className="w-4 h-4 md:w-5 md:h-5 text-purple-500" /></span>
          </div>
          <div className="text-xl md:text-2xl font-bold mb-1">{completedCourses}/{totalCourses}</div>
        </div>
        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col justify-between min-w-[220px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 font-medium text-sm md:text-base">Achievements</span>
            <span className="bg-yellow-100 p-2 rounded-full"><Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" /></span>
          </div>
          <div className="text-xl md:text-2xl font-bold mb-1">{unlockedAchievements}/{totalAchievements}</div>
        </div>
      </div>

      {/* Learning Path Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="font-bold text-xl mb-4">Your Learning Path</h2>
          {learningPath.length > 0 ? (
            <div className="space-y-4">
              {learningPath.slice(0, 3).map((course, index) => (
                <div key={course.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{course.type}</span>
                      <span className="text-xs text-gray-500">{course.duration}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{course.level}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No learning path available</p>
          )}
        </div>
        <div className="flex flex-col gap-6">
          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-xl mb-2">Recent Achievements</h2>
            <div className="grid grid-cols-3 gap-3">
              {achievements.slice(0, 6).map((achievement, index) => (
                <div key={index} className={`text-center p-3 rounded-lg ${achievement.unlocked ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <div className={`text-xs font-medium ${achievement.unlocked ? 'text-green-700' : 'text-gray-500'}`}>
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-xl mb-2">Upcoming Events</h2>
            <div className="space-y-2">
              {events.slice(0, 3).map((event, index) => (
                <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${event.color}`}>
                  {event.icon}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{event.title}</div>
                    <div className="text-xs text-gray-600">{event.desc}</div>
                  </div>
                  <span className={`text-xs font-semibold ${event.dateColor}`}>{event.date}</span>
                </div>
              ))}
          </div>
          </div>
        </div>
      </div>

      {/* Activity and Mentors Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="font-bold text-xl mb-4">Recent Activity</h2>
          {activityWithIcons.length > 0 ? (
          <ul>
              {activityWithIcons.slice(0, 4).map((activity, i) => (
                <li key={i} className="flex items-center gap-3 py-3 border-b last:border-b-0">
                  <span>{activity.icon}</span>
                <div className="flex-1">
                    <span className="font-semibold text-gray-900 block">{activity.text}</span>
                    <span className="text-xs text-gray-500">{activity.date} • Earned {activity.points} points</span>
                </div>
              </li>
            ))}
          </ul>
          ) : (
            <p className="text-gray-500">No recent activity</p>
          )}
          <a href="#" className="mt-4 text-indigo-600 text-sm font-medium hover:underline">View all activity →</a>
        </div>
        {/* Mentors */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="font-bold text-xl mb-4">Available Mentors</h2>
          {mentorsWithAvatars.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {mentorsWithAvatars.slice(0, 4).map((mentor, index) => (
                <div key={mentor.id} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <span className="w-12 h-12 rounded-full border-2 border-indigo-400 overflow-hidden mb-2">
                    <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 object-cover" />
                </span>
                  <span className="text-sm font-semibold text-gray-800 text-center">{mentor.name}</span>
                <span className={`text-xs ${mentor.statusColor}`}>{mentor.status}</span>
                  <span className="text-xs text-gray-500 capitalize">{mentor.role}</span>
              </div>
            ))}
          </div>
          ) : (
            <p className="text-gray-500">No mentors available</p>
          )}
        </div>
      </div>

        {/* Competency Map Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-bold text-xl mb-4">Competency Map</h2>
        {competencyChartData.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2 flex justify-center" style={{height: 300}}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Competency" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                {competencyChartData.map((comp) => (
                  <div key={comp.subject} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-semibold" style={{color: comp.color}}>{comp.subject}</span>
                    <span className="text-lg font-bold" style={{color: comp.color}}>{comp.value}%</span>
              </div>
            ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No competency data available</p>
        )}
        <a href="#" className="mt-4 text-indigo-600 text-sm font-medium hover:underline">View detailed competency map →</a>
      </div>
    </div>
  );
};

export default TeacherDashboardMainPage; 