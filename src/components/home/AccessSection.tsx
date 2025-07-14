import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useInView } from 'react-intersection-observer';
import { UserRole } from '../../types';
import { 
  GraduationCap, 
  Users, 
  Building, 
  Network, 
  Shield,
  ChevronRight 
} from 'lucide-react';

interface AccessSectionProps {
  onRoleSelect: (role: UserRole) => void;
}

const roleCards = [
  {
    role: 'teacher' as UserRole,
    icon: GraduationCap,
    title: 'Teacher',
    titleAr: 'معلم',
    description: 'Access personalized learning pathways and track your professional development',
    descriptionAr: 'الوصول إلى مسارات التعلم الشخصية وتتبع تطويرك المهني',
    color: 'from-blue-500 to-blue-600',
    features: ['Personal Dashboard', 'Course Progress', 'Certificates']
  },
  {
    role: 'trainer' as UserRole,
    icon: Users,
    title: 'Trainer',
    titleAr: 'مدرب',
    description: 'Manage training sessions, track performance, and engage with trainees',
    descriptionAr: 'إدارة جلسات التدريب وتتبع الأداء والتفاعل مع المتدربين',
    color: 'from-green-500 to-green-600',
    features: ['Session Management', 'Performance Analytics', 'Feedback Tools']
  },
  {
    role: 'principal' as UserRole,
    icon: Building,
    title: 'School Principal',
    titleAr: 'مدير مدرسة',
    description: 'Monitor school-wide progress and manage teacher development programs',
    descriptionAr: 'مراقبة التقدم على مستوى المدرسة وإدارة برامج تطوير المعلمين',
    color: 'from-purple-500 to-purple-600',
    features: ['School Analytics', 'Teacher Reports', 'Progress Monitoring']
  },
  {
    role: 'cluster_lead' as UserRole,
    icon: Network,
    title: 'Cluster Lead',
    titleAr: 'قائد المجموعة',
    description: 'Oversee multiple schools and coordinate regional training initiatives',
    descriptionAr: 'الإشراف على عدة مدارس وتنسيق مبادرات التدريب الإقليمية',
    color: 'from-orange-500 to-orange-600',
    features: ['Regional Overview', 'Multi-School Analytics', 'Resource Allocation']
  },
  {
    role: 'admin' as UserRole,
    icon: Shield,
    title: 'Super Admin',
    titleAr: 'مدير النظام',
    description: 'Complete system administration and comprehensive analytics dashboard',
    descriptionAr: 'إدارة النظام الكاملة ولوحة تحكم التحليلات الشاملة',
    color: 'from-red-500 to-red-600',
    features: ['System Management', 'Advanced Analytics', 'User Administration']
  }
];

export const AccessSection: React.FC<AccessSectionProps> = ({ onRoleSelect }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="access" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('accessTitle')}
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('accessSubtitle')}
          </p>
        </motion.div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {roleCards.map((card, index) => (
            <motion.div
              key={card.role}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              onClick={() => onRoleSelect(card.role)}
              className="group cursor-pointer"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 h-full border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  <card.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {isRTL ? card.titleAr : card.title}
                </h3>

                {/* Description */}
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  {isRTL ? card.descriptionAr : card.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {card.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-xs text-blue-200">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <motion.div
                  whileHover={{ x: isRTL ? -5 : 5 }}
                  className="flex items-center justify-between text-white group-hover:text-blue-300 transition-colors"
                >
                  <span className="text-sm font-medium">Access Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Assessment Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 border border-white border-opacity-20"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              AI-Powered Assessment & Learning Pathways
            </h3>
            <p className="text-blue-100 mb-8 max-w-3xl mx-auto">
              Take our comprehensive assessment to receive personalized course recommendations 
              and create your optimal learning pathway based on your current competencies.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Assessment
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};