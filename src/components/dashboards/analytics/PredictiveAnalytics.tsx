import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Calendar, 
  BarChart3,
  Users,
  BookOpen,
  Award,
  Activity
} from 'lucide-react';

interface PredictionData {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
  trend: 'up' | 'down' | 'stable';
}

interface PredictiveAnalyticsProps {
  predictions: PredictionData[];
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ predictions }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'green';
      case 'down': return 'red';
      default: return 'gray';
    }
  };

  const getMetricIcon = (metric: string) => {
    if (metric.toLowerCase().includes('user')) return Users;
    if (metric.toLowerCase().includes('course')) return BookOpen;
    if (metric.toLowerCase().includes('completion')) return Award;
    if (metric.toLowerCase().includes('system')) return Activity;
    return BarChart3;
  };

  const extendedPredictions = [
    ...predictions,
    {
      metric: 'Course Enrollments',
      current: 1247,
      predicted: 1456,
      confidence: 86,
      timeframe: '14 days',
      trend: 'up' as const
    },
    {
      metric: 'Session Duration',
      current: 24,
      predicted: 28,
      confidence: 79,
      timeframe: '7 days',
      trend: 'up' as const
    },
    {
      metric: 'Drop-off Rate',
      current: 12,
      predicted: 9,
      confidence: 82,
      timeframe: '30 days',
      trend: 'down' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Predictive Analytics Suite
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          AI-powered forecasting with confidence scoring and trend analysis
        </p>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {extendedPredictions.map((prediction, index) => {
          const TrendIcon = getTrendIcon(prediction.trend);
          const MetricIcon = getMetricIcon(prediction.metric);
          const trendColor = getTrendColor(prediction.trend);
          const change = ((prediction.predicted - prediction.current) / prediction.current * 100);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r from-${trendColor}-500 to-${trendColor}-600 p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <MetricIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{prediction.metric}</h3>
                      <p className="text-white/80 text-sm">{prediction.timeframe} forecast</p>
                    </div>
                  </div>
                  <TrendIcon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Current vs Predicted */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {prediction.current.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Predicted</p>
                    <p className={`text-2xl font-bold text-${trendColor}-600`}>
                      {prediction.predicted.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Change Indicator */}
                <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                  prediction.trend === 'up' ? 'bg-green-50 dark:bg-green-900/20' :
                  prediction.trend === 'down' ? 'bg-red-50 dark:bg-red-900/20' :
                  'bg-gray-50 dark:bg-gray-700'
                }`}>
                  <TrendIcon className={`w-4 h-4 text-${trendColor}-600`} />
                  <span className={`text-sm font-medium text-${trendColor}-700 dark:text-${trendColor}-300`}>
                    {change > 0 ? '+' : ''}{change.toFixed(1)}% change expected
                  </span>
                </div>

                {/* Confidence Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      AI Confidence
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {prediction.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r from-${trendColor}-400 to-${trendColor}-600`}
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.confidence}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Timeframe */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Forecast period: {prediction.timeframe}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trend Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          Trend Analysis & Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Insights */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Key Insights</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    User growth acceleration detected
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    15% increase expected over next 30 days
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Course completion rates improving
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    AI suggests content optimization is working
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    System load trending upward
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Consider infrastructure scaling
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Risk Factors</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-900 dark:text-white">Model Accuracy</span>
                <span className="text-sm font-medium text-green-600">High (94%)</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-900 dark:text-white">Data Quality</span>
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-900 dark:text-white">Prediction Stability</span>
                <span className="text-sm font-medium text-yellow-600">Moderate</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-900 dark:text-white">External Factors</span>
                <span className="text-sm font-medium text-red-600">Monitor</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};