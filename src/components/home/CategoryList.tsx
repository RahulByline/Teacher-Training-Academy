import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { BookOpen, ChevronRight, Folder, Grid } from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';

interface Category {
  id: string;
  name: string;
  description?: string;
  idnumber?: string;
  coursecount?: number;
  parent?: string;
  depth?: number;
}

interface CategoryListProps {
  onCategorySelect: (categoryId: string, categoryName: string) => void;
  selectedCategory: string | null;
}

export const CategoryList: React.FC<CategoryListProps> = ({ 
  onCategorySelect, 
  selectedCategory 
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://iomad.bylinelms.com/webservice/rest/server.php', {
          params: {
            wstoken: '4a2ba2d6742afc7d13ce4cf486ba7633',
            wsfunction: 'core_course_get_categories',
            moodlewsrestformat: 'json',
          },
        });

        if (response.data && Array.isArray(response.data)) {
          // Filter out system categories and only show top-level categories
          const filteredCategories = response.data
            .filter((cat: any) => cat.visible !== 0 && cat.coursecount > 0)
            .map((cat: any) => ({
              id: cat.id.toString(),
              name: cat.name,
              description: cat.description,
              idnumber: cat.idnumber,
              coursecount: cat.coursecount || 0,
              parent: cat.parent?.toString(),
              depth: cat.depth || 0
            }))
            .sort((a, b) => b.coursecount - a.coursecount); // Sort by course count

          setCategories(filteredCategories);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch course categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('teaching') || name.includes('education')) return '👨‍🏫';
    if (name.includes('technology') || name.includes('digital')) return '💻';
    if (name.includes('leadership') || name.includes('management')) return '👑';
    if (name.includes('assessment') || name.includes('evaluation')) return '📊';
    if (name.includes('language') || name.includes('communication')) return '🗣️';
    if (name.includes('science') || name.includes('stem')) return '🔬';
    if (name.includes('arts') || name.includes('creative')) return '🎨';
    if (name.includes('health') || name.includes('wellness')) return '🏥';
    return '📚';
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-red-500 to-red-600',
      'from-teal-500 to-teal-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 mb-4">
          <Folder className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Unable to Load Categories
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {error}. Please try again later.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-20">
        <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Categories Available
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          No course categories are currently available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Browse by Category
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore our {categories.length} course categories and discover the perfect learning path for your professional development.
        </p>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => onCategorySelect(category.id, category.name)}
            className={`cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 relative ${selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            {/* Header with wave/curve */}
            <div className="relative h-32 bg-gray-100 flex items-end justify-center overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-tr ${getCategoryColor(index)} opacity-80`} />
              {/* Optional: category icon in a circle */}
              <div className="relative z-10 mb-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center text-3xl border-4 border-white -mb-8">
                  {getCategoryIcon(category.name)}
                </div>
              </div>
              {/* SVG wave */}
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 400 30" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0 0C66.6667 30 133.333 30 200 0C266.667 30 333.333 30 400 0V30H0V0Z" fill="#fff"/>
              </svg>
            </div>
            {/* Card Body */}
            <div className="pt-12 pb-6 px-6 flex flex-col min-h-[180px]">
              <h4 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">{category.name}</h4>
              {category.description && (
                <p className="text-gray-600 text-base mb-4 line-clamp-3">{category.description.replace(/<[^>]*>/g, '').substring(0, 100)}{category.description.length > 100 ? '...' : ''}</p>
              )}
              <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">{category.name.charAt(0)}</span>
                  <span className="text-sm text-gray-700 font-medium">{category.coursecount} courses</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* All Categories Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center"
      >
        <button
          onClick={() => onCategorySelect('all', 'All Categories')}
          className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          <Grid className="w-5 h-5 inline mr-2" />
          View All Categories
        </button>
      </motion.div>
    </div>
  );
};