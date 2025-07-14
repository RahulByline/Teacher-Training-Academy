import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb, 
  Bell,
  Filter,
  Search,
  Clock,
  Target,
  Zap,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'anomaly' | 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timestamp: number;
  actionable: boolean;
}

interface AIInsightsHubProps {
  insights: AIInsight[];
}

export const AIInsightsHub: React.FC<AIInsightsHubProps> = ({ insights }) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return AlertTriangle;
      case 'trend': return TrendingUp;
      case 'recommendation': return Lightbulb;
      case 'alert': return Bell;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string, impact: string) => {
    if (type === 'anomaly' || impact === 'high') return 'red';
    if (type === 'alert' || impact === 'medium') return 'yellow';
    if (type === 'trend') return 'blue';
    if (type === 'recommendation') return 'purple';
    return 'green';
  };

  const filteredInsights = insights.filter(insight => {
    const matchesFilter = filter === 'all' || insight.type === filter;
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            AI Insights Hub
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time intelligence with {insights.length} active insights
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="anomaly">Anomalies</option>
            <option value="trend">Trends</option>
            <option value="recommendation">Recommendations</option>
            <option value="alert">Alerts</option>
          </select>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const color = getInsightColor(insight.type, insight.impact);
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r from-${color}-500 to-${color}-600 p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                        {insight.type}
                      </span>
                      <div className="text-white font-semibold">
                        Confidence: {insight.confidence}%
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {insight.impact.toUpperCase()} IMPACT
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {insight.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {insight.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(insight.timestamp).toLocaleTimeString()}</span>
                  </div>
                  
                  {insight.actionable && (
                    <button className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-${color}-500 to-${color}-600 text-white rounded-lg hover:shadow-lg transition-all duration-200`}>
                      <Target className="w-4 h-4" />
                      Take Action
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredInsights.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No insights found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your filters or search terms
          </p>
        </motion.div>
      )}
    </div>
  );
};