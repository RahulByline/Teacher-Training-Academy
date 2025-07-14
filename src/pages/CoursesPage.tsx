import React, { useEffect, useState, useMemo } from 'react';
import { getAllCourses } from '../services/apiService';
import { Course, Category } from '../types';
import { useTranslation } from 'react-i18next';
import { Search, Grid, List } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

const CoursesPage: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setLoading(true);
    getAllCourses()
      .then((coursesData) => {
        setCourses(coursesData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = courses;
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.shortname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCourses(filtered);
  }, [courses, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">{t('courses')}</h1>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Input
                type="text"
                placeholder={t('search') as string}
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 rounded border"
              />
              <Search className="absolute left-2 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              onClick={() => setViewMode('grid')}
              className="ml-2"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <AnimatePresence>
            {filteredCourses.length === 0 ? (
              <motion.div
                key="no-courses"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500 py-12"
              >
                {t('no_courses_found')}
              </motion.div>
            ) : viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;