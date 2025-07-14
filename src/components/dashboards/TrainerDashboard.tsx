import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Calendar, 
  Star, 
  TrendingUp,
  Clock,
  MessageSquare,
  Award,
  Plus,
  BarChart3
} from 'lucide-react';

export const TrainerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const stats = [
    {
      title: 'Sessions Delivered',
      value: 45,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+5 this month'
    },
    {
      title: 'Active Trainees',
      value: 234,
      icon: Users,
      color: 'bg-green-500',
      change: '+12 this week'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      icon: Star,
      color: 'bg-yellow-500',
      change: '+0.2 improvement'
    },
    {
      title: 'Completion Rate',
      value: '92%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+3% this month'
    }
  ];

  const recentSessions = [
    {
      id: '1',
      title: 'Advanced Teaching Methodologies',
      date: '2024-01-12',
      attendees: 25,
      rating: 4.9,
      type: 'VILT'
    },
    {
      id: '2',
      title: 'Assessment Strategies',
      date: '2024-01-10',
      attendees: 18,
      rating: 4.7,
      type: 'ILT'
    }
  ];

  const upcomingSessions = [
    {
      id: '1',
      title: 'Digital Learning Tools',
      date: '2024-01-15',
      time: '10:00 AM',
      registered: 22,
      capacity: 30
    },
    {
      id: '2',
      title: 'Classroom Management',
      date: '2024-01-18',
      time: '2:00 PM',
      registered: 15,
      capacity: 25
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('welcome')}, {user?.firstname}! 🎓
            </h1>
            <p className="text-green-100 text-lg mb-4">
              Your training impact dashboard
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>234 Active Trainees</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>4.8/5 Average Rating</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Users className="w-16 h-16 text-white" />
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Session Management</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Session
              </button>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 mb-3">Upcoming Sessions</h3>
              {upcomingSessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{session.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {session.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.time}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {session.registered}/{session.capacity} registered
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(session.registered / session.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Session Ratings</h3>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-4">{rating}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${rating === 5 ? 70 : rating === 4 ? 25 : 5}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {rating === 5 ? '70%' : rating === 4 ? '25%' : '5%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Completion Trends</h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">92%</div>
                  <div className="text-sm text-gray-600">Average completion rate</div>
                  <div className="text-xs text-green-600 mt-2">↑ 3% from last month</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Feedback */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Feedback</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-sm">4.9/5</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  "Excellent session on teaching methodologies. Very practical and engaging."
                </p>
                <span className="text-xs text-gray-500">- Sarah M.</span>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-sm">4.8/5</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  "Great insights on assessment strategies. Will definitely apply these techniques."
                </p>
                <span className="text-xs text-gray-500">- Ahmed K.</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Schedule Session
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                View Messages
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Award className="w-4 h-4" />
                Issue Certificates
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};