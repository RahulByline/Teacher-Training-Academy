import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Eye, 
  Clock, 
  Cpu, 
  Database, 
  Wifi, 
  Globe,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

interface RealTimeMetricsProps {
  data: any;
  realTimeEnabled: boolean;
}

export const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ data, realTimeEnabled }) => {
  const [liveData, setLiveData] = useState({
    activeUsers: 0,
    currentSessions: 0,
    pageViews: 0,
    avgResponseTime: 0,
    systemLoad: 0,
    memoryUsage: 0,
    networkLatency: 0,
    uptime: 0
  });

  useEffect(() => {
    if (realTimeEnabled) {
      const interval = setInterval(() => {
        setLiveData(prev => ({
          activeUsers: Math.max(0, prev.activeUsers + Math.floor(Math.random() * 10 - 5)),
          currentSessions: Math.max(0, prev.currentSessions + Math.floor(Math.random() * 6 - 3)),
          pageViews: prev.pageViews + Math.floor(Math.random() * 20),
          avgResponseTime: Math.max(50, prev.avgResponseTime + Math.floor(Math.random() * 40 - 20)),
          systemLoad: Math.max(0, Math.min(100, prev.systemLoad + Math.floor(Math.random() * 10 - 5))),
          memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + Math.floor(Math.random() * 8 - 4))),
          networkLatency: Math.max(10, prev.networkLatency + Math.floor(Math.random() * 30 - 15)),
          uptime: 99.8 + Math.random() * 0.2
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [realTimeEnabled]);

  const metrics = [
    {
      label: 'Active Users',
      value: liveData.activeUsers || 247,
      icon: Users,
      color: 'blue',
      change: '+12',
      unit: ''
    },
    {
      label: 'Live Sessions',
      value: liveData.currentSessions || 89,
      icon: Activity,
      color: 'green',
      change: '+5',
      unit: ''
    },
    {
      label: 'Page Views',
      value: liveData.pageViews || 1543,
      icon: Eye,
      color: 'purple',
      change: '+234',
      unit: ''
    },
    {
      label: 'Response Time',
      value: liveData.avgResponseTime || 127,
      icon: Clock,
      color: 'orange',
      change: '-15',
      unit: 'ms'
    },
    {
      label: 'CPU Usage',
      value: data?.systemHealth?.cpu || liveData.systemLoad || 67,
      icon: Cpu,
      color: 'red',
      change: '+3',
      unit: '%'
    },
    {
      label: 'Memory',
      value: data?.systemHealth?.memory || liveData.memoryUsage || 54,
      icon: Database,
      color: 'indigo',
      change: '+2',
      unit: '%'
    },
    {
      label: 'Network',
      value: data?.systemHealth?.latency || liveData.networkLatency || 23,
      icon: Wifi,
      color: 'teal',
      change: '-8',
      unit: 'ms'
    },
    {
      label: 'Uptime',
      value: data?.systemHealth?.uptime || liveData.uptime || 99.8,
      icon: Globe,
      color: 'emerald',
      change: '+0.1',
      unit: '%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Real-Time Metrics Center
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Live system monitoring with 2-second refresh intervals
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            realTimeEnabled 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              realTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm font-medium">
              {realTimeEnabled ? 'Live Updates' : 'Paused'}
            </span>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Animated Background */}
            <div className={`h-1 bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-600`}>
              {realTimeEnabled && (
                <motion.div
                  className="h-full bg-white/30"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br from-${metric.color}-500 to-${metric.color}-600 rounded-xl flex items-center justify-center`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  metric.change.startsWith('+') 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {metric.change}
                </div>
              </div>

              {/* Value */}
              <div className="mb-2">
                <motion.span
                  key={metric.value}
                  initial={{ scale: 1.1, color: `rgb(var(--color-${metric.color}-500))` }}
                  animate={{ scale: 1, color: 'inherit' }}
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                >
                  {typeof metric.value === 'number' && metric.value % 1 !== 0 
                    ? metric.value.toFixed(1) 
                    : metric.value.toLocaleString()}
                </motion.span>
                <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">
                  {metric.unit}
                </span>
              </div>

              {/* Label */}
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                {metric.label}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-600`}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min(100, typeof metric.value === 'number' ? metric.value : 50)}%` 
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          Live Activity Feed
        </h3>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {[
            { time: '2s ago', event: 'New user registration', type: 'success' },
            { time: '5s ago', event: 'Course completion detected', type: 'info' },
            { time: '12s ago', event: 'High CPU usage alert', type: 'warning' },
            { time: '18s ago', event: 'System backup completed', type: 'success' },
            { time: '25s ago', event: 'New course enrollment', type: 'info' },
            { time: '31s ago', event: 'Memory usage normalized', type: 'success' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-white">
                  {activity.event}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};