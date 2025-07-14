import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useInView } from 'react-intersection-observer';
import { CategoryList } from './CategoryList';
import { CourseListByCategory } from './CourseListByCategory';

export const CourseBrowserSection: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setSelectedCategory(categoryId);
    setSelectedCategoryName(categoryName);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedCategoryName('');
  };

  return (
    <section id="course-browser" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {!selectedCategory && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Discover Your Perfect Course
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Browse our comprehensive course catalog by category and find the training that matches your professional development goals.
            </p>
          </motion.div>
        )}

        {/* Dynamic Content */}
        <motion.div
          key={selectedCategory ? 'courses' : 'categories'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {selectedCategory ? (
            <CourseListByCategory
              categoryId={selectedCategory}
              categoryName={selectedCategoryName}
              onBack={handleBackToCategories}
            />
          ) : (
            <CategoryList
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
          )}
        </motion.div>

        {/* Call to Action */}
        {!selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center mt-16 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Our course catalog is constantly growing. Contact us to suggest new courses or get personalized recommendations based on your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                Request Custom Training
              </button>
              <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-200">
                Contact Support
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};