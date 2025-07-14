import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Database, 
  Wifi, 
  Shield, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  HardDrive,
  Network,
  Zap
} from 'lucide-react';

interface SystemHealth {
  cpu: number;
  memory: number;
  latency: number;
  uptime: number;
}

interface PerformanceMonitorProps {
  systemHealth?: SystemHealth;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ systemHealth }) => {
  const [liveMetrics, setLiveMetrics] = useState({
    cpu: systemHealth?.cpu || 67,
    memory: systemHealth?.memory || 54,
    latency: systemHealth?.latency || 23,
    uptime: systemHealth?.uptime || 99.8,
    diskUsage: 78,
    networkThroughput: 245,
    activeConnections: 1247,
    errorRate: 0.02
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        latency: Math.max(0, prev.latency + (Math.random() - 0.5) * 20),
        networkThroughput: Math.max(0, prev.networkThroughput + (Math.random() - 0.5) * 50),
        activeConnections: Math.max(0, prev.activeConnections + Math.floor((Math.random() - 0.5) * 100)),
        errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() - 0.5) * 0.01))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getHealthStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return { status: 'critical', color: 'red' };
    if (value >= thresholds.warning) return { status: 'warning', color: 'yellow' };
    return { status: 'healthy', color: 'green' };
  };

  const metrics = [
    {
      label: 'CPU Usage',
      value: liveMetrics.cpu,
      unit: '%',
      icon: Cpu,
      thresholds: { warning: 70, critical: 85 },
      description: 'Processor utilization across all cores'
    },
    {
      label: 'Memory Usage',
      value: liveMetrics.memory,
      unit: '%',
      icon: Database,
      thresholds: { warning: 80, critical: 90 },
      description: 'RAM utilization and availability'
    },
    {
      label: 'Network Latency',
      value: liveMetrics.latency,
      unit: 'ms',
      icon: Wifi,
      thresholds: { warning: 100, critical: 200 },
      description: 'Average response time for network requests'
    },
    {
      label: 'Disk Usage',
      value: liveMetrics.diskUsage,
      unit: '%',
      icon: HardDrive,
      thresholds: { warning: 80, critical: 90 },
      description: 'Storage space utilization'
    },
    {
      label: 'Network Throughput',
      value: liveMetrics.networkThroughput,
      unit: 'MB/s',
      icon: Network,
      thresholds: { warning: 800, critical: 950 },
      description: 'Data transfer rate'
    },
    {
      label: 'Active Connections',
      value: liveMetrics.activeConnections,
      unit: '',
      icon: Activity,
      thresholds: { warning: 2000, critical: 2500 },
      description: 'Current active user connections'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Performance Monitor
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time system health and performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 dark:text-green-300 font-medium">
              System Healthy
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {liveMetrics.uptime.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Uptime</div>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold">99.8%</div>
            <div className="text-blue-100 text-sm">Uptime</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold">{liveMetrics.errorRate.toFixed(2)}%</div>
            <div className="text-blue-100 text-sm">Error Rate</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold">{liveMetrics.activeConnections.toLocaleString()}</div>
            <div className="text-blue-100 text-sm">Connections</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold">Secure</div>
            <div className="text-blue-100 text-sm">Status</div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const health = getHealthStatus(metric.value, metric.thresholds);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Status Indicator */}
              <div className={`h-1 bg-gradient-to-r from-${health.color}-400 to-${health.color}-600`}></div>
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${health.color}-500 to-${health.color}-600 rounded-xl flex items-center justify-center`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {health.status === 'healthy' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : health.status === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      health.status === 'healthy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      health.status === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {health.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Value */}
                <div className="mb-3">
                  <motion.span
                    key={metric.value}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
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

                {/* Description */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {metric.description}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r from-${health.color}-400 to-${health.color}-600`}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min(100, (metric.value / (metric.thresholds.critical * 1.2)) * 100)}%` 
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                {/* Thresholds */}
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0</span>
                  <span className="text-yellow-600">Warning: {metric.thresholds.warning}{metric.unit}</span>
                  <span className="text-red-600">Critical: {metric.thresholds.critical}{metric.unit}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* System Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          System Alerts & Notifications
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                All systems operating normally
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                No critical alerts detected
              </p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Clock className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Scheduled maintenance window
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                System update planned for 2:00 AM UTC
              </p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Tomorrow
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};