import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useInView } from 'react-intersection-observer';
import { Target, Users, BookOpen, Award, TrendingUp, Globe } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Structured Learning',
    description: 'Role-based learning pathways tailored to your professional needs',
    color: 'text-blue-600'
  },
  {
    icon: Users,
    title: 'Expert Trainers',
    description: 'Learn from industry experts and certified professionals',
    color: 'text-green-600'
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Content',
    description: 'Extensive library of courses covering all aspects of education',
    color: 'text-purple-600'
  },
  {
    icon: Award,
    title: 'Certification',
    description: 'Earn recognized certificates upon course completion',
    color: 'text-orange-600'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics',
    color: 'text-red-600'
  },
  {
    icon: Globe,
    title: 'Global Standards',
    description: 'Training programs aligned with international best practices',
    color: 'text-teal-600'
  }
];

export const AboutSection: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('aboutTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('aboutDescription')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 mb-6`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                10,000+
              </motion.div>
              <div className="text-blue-100">Teachers Trained</div>
            </div>
            
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                500+
              </motion.div>
              <div className="text-blue-100">Courses Available</div>
            </div>
            
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                95%
              </motion.div>
              <div className="text-blue-100">Completion Rate</div>
            </div>
            
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                50+
              </motion.div>
              <div className="text-blue-100">Countries Served</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};