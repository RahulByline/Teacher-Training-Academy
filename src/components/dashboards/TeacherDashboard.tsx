import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Course, Session, Achievement } from '../../types';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Calendar, 
  Clock,
  Target,
  Star,
  ChevronRight,
  Play
} from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
import { CourseCard } from '../CourseCard';

export const TeacherDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const upcomingSessions: Session[] = [
    {
      id: '1',
      title: 'Advanced Teaching Methodologies',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'VILT',
      trainer: 'Dr. Sarah Ahmed',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Assessment Strategies Workshop',
      date: '2024-01-18',
      time: '2:00 PM',
      type: 'ILT',
      trainer: 'Prof. Mohammed Ali',
      status: 'upcoming'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Course Completion Master',
      description: 'Completed 10 courses with excellence',
      icon: '🏆',
      earnedDate: '2024-01-10',
      category: 'Learning'
    },
    {
      id: '2',
      title: 'Assessment Expert',
      description: 'Scored 95%+ in 5 assessments',
      icon: '⭐',
      earnedDate: '2024-01-08',
      category: 'Performance'
    }
  ];

  const recommendations = [
    {
      id: '1',
      title: 'Digital Teaching Tools',
      reason: 'Based on your interest in technology integration',
      match: 92
    },
    {
      id: '2',
      title: 'Classroom Management Strategies',
      reason: 'Recommended for your teaching level',
      match: 88
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const userCourses = await apiService.getUserCourses(user.id);
        setCourses(userCourses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const stats = [
    {
      title: 'Enrolled Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Completed',
      value: courses.filter(c => c.progress === 100).length,
      icon: Award,
      color: 'bg-green-500',
      change: '+3 this month'
    },
    {
      title: 'In Progress',
      value: courses.filter(c => c.progress && c.progress > 0 && c.progress < 100).length,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: 'On track'
    },
    {
      title: 'Upcoming Sessions',
      value: upcomingSessions.length,
      icon: Calendar,
      color: 'bg-purple-500',
      change: 'This week'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('welcome')}, {user?.firstname}! 👋
            </h1>
            <p className="text-blue-100 text-lg mb-4">
              Ready to continue your learning journey?
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>Learning Goal: 80% completion rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>Current Level: Advanced</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
            <p className="text-xs text-green-600">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Path */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('myLearning')}</h2>
              <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.slice(0, 4).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No courses enrolled yet</p>
              </div>
            )}
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('recommendations')}</h2>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${rec.match}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{rec.match}% match</span>
                    </div>
                  </div>
                  <button className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('upcomingSessions')}</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{session.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{session.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      session.type === 'VILT' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {session.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('achievements')}</h2>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{achievement.title}</h3>
                    <p className="text-xs text-gray-600 mb-1">{achievement.description}</p>
                    <span className="text-xs text-gray-500">{achievement.earnedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};