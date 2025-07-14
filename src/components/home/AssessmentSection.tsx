import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useInView } from 'react-intersection-observer';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Zap,
  BarChart3
} from 'lucide-react';
import { Button } from '../ui/Button';

const assessmentFeatures = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced algorithms analyze your competencies and learning patterns',
    color: 'text-purple-600'
  },
  {
    icon: Target,
    title: 'Personalized Pathways',
    description: 'Custom learning routes based on your current skills and goals',
    color: 'text-blue-600'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Real-time monitoring of your development and achievements',
    color: 'text-green-600'
  },
  {
    icon: Award,
    title: 'Competency Mapping',
    description: 'Comprehensive skill assessment aligned with teaching standards',
    color: 'text-orange-600'
  }
];

const assessmentSteps = [
  {
    step: 1,
    title: 'Initial Assessment',
    description: 'Complete a comprehensive evaluation of your current teaching competencies'
  },
  {
    step: 2,
    title: 'AI Analysis',
    description: 'Our AI engine analyzes your responses and identifies strengths and gaps'
  },
  {
    step: 3,
    title: 'Pathway Generation',
    description: 'Receive a personalized learning pathway with recommended courses'
  },
  {
    step: 4,
    title: 'Continuous Monitoring',
    description: 'Track progress and receive updated recommendations as you learn'
  }
];

export const AssessmentSection: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="assessment" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('assessmentTitle')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('assessmentSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessmentFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Assessment Process */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  How It Works
                </h3>
              </div>

              <div className="space-y-4">
                {assessmentSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
                className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => window.open('https://riyara-dashboard.bylinelms.com/self-assessment/', '_blank')}
                >
                  <BarChart3 className="w-5 h-5" />
                  Start Assessment
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                95%
              </motion.div>
              <div className="text-blue-100">Accuracy Rate</div>
            </div>
            
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                1,500+
              </motion.div>
              <div className="text-blue-100">Assessments Completed</div>
            </div>
            
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                300+
              </motion.div>
              <div className="text-blue-100">Learning Pathways</div>
            </div>
            
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                92%
              </motion.div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};