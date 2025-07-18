import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { BookOpen, ChevronRight, Folder, Grid, ChevronLeft } from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
import Tilt from 'react-parallax-tilt';

interface Category {
  id: string;
  name: string;
  description?: string;
  imageurl?: string;
  idnumber?: string;
  coursecount?: number;
  parent?: string;
  depth?: number;
}

interface CategoryListProps {
  onCategorySelect: (categoryId: string, categoryName: string) => void;
  selectedCategory: string | null;
}

// Helper to extract image from description HTML
function extractImageFromDescription(desc?: string) {
  if (!desc) return undefined;
  const match = desc.match(/<img[^>]+src=["']([^"']+)["']/);
  return match ? match[1] : undefined;
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
  const scrollRef = useRef<HTMLDivElement>(null);

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
              imageurl: cat.imageurl || extractImageFromDescription(cat.description),
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

  // Get a themed image for each category (Unsplash demo images)
  const getCategoryImage = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('teaching') || name.includes('education')) return 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80';
    if (name.includes('technology') || name.includes('digital')) return 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80';
    if (name.includes('leadership') || name.includes('management')) return 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80';
    if (name.includes('assessment') || name.includes('evaluation')) return 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80';
    if (name.includes('language') || name.includes('communication')) return 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80';
    if (name.includes('science') || name.includes('stem')) return 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80';
    if (name.includes('arts') || name.includes('creative')) return 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80';
    if (name.includes('health') || name.includes('wellness')) return 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80';
    return 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80';
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
      <div className="relative">
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-white/80 hover:bg-white shadow rounded-full p-2 border border-gray-200 transition disabled:opacity-30"
          onClick={() => {
            if (scrollRef.current) scrollRef.current.scrollBy({ left: -360, behavior: 'smooth' });
          }}
          style={{ display: categories.length > 1 ? 'block' : 'none' }}
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white/80 hover:bg-white shadow rounded-full p-2 border border-gray-200 transition disabled:opacity-30"
          onClick={() => {
            if (scrollRef.current) scrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
          }}
          style={{ display: categories.length > 1 ? 'block' : 'none' }}
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto flex-nowrap gap-6 py-2 px-1 scroll-smooth scroll-snap-x items-stretch hide-scrollbar no-scrollbar"
          style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <Tilt
              key={category.id}
              glareEnable={true}
              glareMaxOpacity={0.15}
              glareColor="#ffffff"
              glarePosition="all"
              tiltMaxAngleX={15}
              tiltMaxAngleY={15}
              transitionSpeed={250}
              className="min-w-[306px] max-w-[306px] h-[378px] flex-shrink-0 scroll-snap-start group"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => onCategorySelect(category.id, category.name)}
                className={`cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-150 overflow-hidden border border-gray-100 relative ${selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''} group-hover:scale-110 group-hover:z-50 flex flex-col h-full`}
              >
                {/* Header with wave/curve */}
                <div className="relative w-full h-[207px] flex items-end justify-center overflow-hidden rounded-t-2xl group">
                  {/* Category image background with hover zoom/brighten */}
                  <img
                    src={category.imageurl || getCategoryImage(category.name)}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover object-center z-0 rounded-t-2xl transition-transform transition-filter duration-150 group-hover:scale-105 group-hover:brightness-110"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 z-30 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-t-2xl pointer-events-none" />
                  {/* Bottom gradient overlay for text readability */}
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/30 to-transparent z-20 pointer-events-none rounded-b-none rounded-t-2xl" />
                  {/* Color overlay for theme */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${getCategoryColor(index)} opacity-40 z-10 rounded-t-2xl`} />
                </div>
                {/* Card Body */}
                <div className="py-6 px-6 flex flex-col min-h-[120px] flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{category.name}</h4>
                  {category.description && (
                    <p className="text-gray-600 text-base mb-4 line-clamp-3">{category.description.replace(/<[^>]*>/g, '').substring(0, 100)}{category.description.length > 100 ? '...' : ''}</p>
                  )}
                  <div className="flex items-center mt-auto pt-2">
                    <span className="text-sm text-gray-700 font-medium">{category.coursecount} courses</span>
                  </div>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
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