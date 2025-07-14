import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle,
  ArrowRight,
  Filter,
  Star,
  Zap,
  Users,
  BookOpen,
  Settings
} from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  roi: number;
  category: string;
}

interface SmartRecommendationsProps {
  recommendations: Recommendation[];
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ recommendations }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('roi');

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'red';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('learning')) return BookOpen;
    if (category.toLowerCase().includes('user')) return Users;
    if (category.toLowerCase().includes('system')) return Settings;
    return Target;
  };

  const extendedRecommendations = [
    ...recommendations,
    {
      id: '4',
      title: 'Implement Gamification Elements',
      description: 'Add badges, leaderboards, and achievement systems to increase user engagement',
      impact: '+35% engagement',
      effort: 'medium' as const,
      roi: 280,
      category: 'User Experience'
    },
    {
      id: '5',
      title: 'AI-Powered Content Curation',
      description: 'Use machine learning to automatically suggest relevant courses to users',
      impact: '+22% course discovery',
      effort: 'high' as const,
      roi: 420,
      category: 'Learning Optimization'
    },
    {
      id: '6',
      title: 'Microlearning Module Creation',
      description: 'Break down long courses into bite-sized, digestible learning modules',
      impact: '+28% completion',
      effort: 'medium' as const,
      roi: 195,
      category: 'Content Strategy'
    }
  ];

  const filteredRecommendations = extendedRecommendations
    .filter(rec => filter === 'all' || rec.effort === filter)
    .sort((a, b) => {
      if (sortBy === 'roi') return b.roi - a.roi;
      if (sortBy === 'effort') {
        const effortOrder = { low: 1, medium: 2, high: 3 };
        return effortOrder[a.effort] - effortOrder[b.effort];
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Smart Recommendations Engine
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            AI-generated optimization suggestions with ROI analysis
          </p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Efforts</option>
            <option value="low">Low Effort</option>
            <option value="medium">Medium Effort</option>
            <option value="high">High Effort</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="roi">Sort by ROI</option>
            <option value="effort">Sort by Effort</option>
          </select>
        </div>
      </div>

      {/* ROI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Total Potential ROI</h3>
            <p className="text-green-100">
              Implementing all recommendations could yield significant returns
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {extendedRecommendations.reduce((sum, rec) => sum + rec.roi, 0)}%
            </div>
            <div className="text-green-100 text-sm">Combined ROI</div>
          </div>
        </div>
      </motion.div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecommendations.map((recommendation, index) => {
          const effortColor = getEffortColor(recommendation.effort);
          const CategoryIcon = getCategoryIcon(recommendation.category);
          
          return (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {recommendation.title}
                      </h3>
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {recommendation.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      ROI: {recommendation.roi}%
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {recommendation.description}
                </p>
              </div>

              {/* Metrics */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Impact</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {recommendation.impact}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Effort</span>
                    </div>
                    <div className={`text-lg font-bold text-${effortColor}-600 capitalize`}>
                      {recommendation.effort}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">ROI</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {recommendation.roi}%
                    </div>
                  </div>
                </div>

                {/* Effort Indicator */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Implementation Effort
                    </span>
                    <span className={`text-sm font-bold text-${effortColor}-600 capitalize`}>
                      {recommendation.effort}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r from-${effortColor}-400 to-${effortColor}-600`}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: recommendation.effort === 'low' ? '33%' : 
                               recommendation.effort === 'medium' ? '66%' : '100%' 
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                    <Zap className="w-4 h-4" />
                    Implement
                  </button>
                  <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Implementation Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          Recommended Implementation Timeline
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">Quick Wins (Week 1-2)</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Implement low-effort, high-impact recommendations first
              </p>
            </div>
            <span className="text-sm font-medium text-green-600">Low Effort</span>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">Medium-term Goals (Month 1-2)</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Focus on medium-effort recommendations with substantial ROI
              </p>
            </div>
            <span className="text-sm font-medium text-yellow-600">Medium Effort</span>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">Strategic Initiatives (Quarter 1-2)</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Plan and execute high-effort, transformational changes
              </p>
            </div>
            <span className="text-sm font-medium text-red-600">High Effort</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};