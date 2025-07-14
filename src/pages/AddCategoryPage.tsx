import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { CategoryList } from '../components/admin/CategoryList';
import { CourseList } from '../components/admin/CourseList';
import { AddCategoryModal } from '../components/admin/AddCategoryModal';
import { AddCourseModal } from '../components/admin/AddCourseModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from '../components/ui/Toaster';
import { apiService } from '../services/api';
import { 
  Plus, 
  FolderPlus, 
  BookOpen, 
  Home, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Category {
  id: number;
  name: string;
  description?: string;
  parent: number;
  coursecount: number;
  visible: number;
  depth: number;
  path: string;
}

interface Course {
  id: number;
  fullname: string;
  shortname: string;
  summary: string;
  categoryid: number;
  visible: number;
  startdate: number;
  enddate: number;
  format: string;
}

const AddCategoryPage: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const categoriesData = await apiService.getCourseCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesByCategory = async (categoryId: number) => {
    setCoursesLoading(true);
    try {
      const coursesData = await apiService.getCoursesByCategory(categoryId);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    fetchCoursesByCategory(category.id);
  };

  const handleCategoryCreated = (newCategory: Category) => {
    setCategories(prev => [...prev, newCategory]);
    setShowCategoryModal(false);
    toast.success('Category created successfully');
  };

  const handleCourseCreated = (newCourse: Course) => {
    if (selectedCategory && newCourse.categoryid === selectedCategory.id) {
      setCourses(prev => [...prev, newCourse]);
    }
    setShowCourseModal(false);
    toast.success('Course created successfully');
  };

  const handleRefresh = () => {
    fetchCategories();
    if (selectedCategory) {
      fetchCoursesByCategory(selectedCategory.id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
          <ChevronRight className="w-4 h-4" />
          <span>Courses & Categories</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">
            Create Course/Categories
          </span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Course Categories & Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your course structure and organization
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
          {/* Left Panel - Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
            {/* Categories Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FolderPlus className="w-6 h-6" />
                  <div>
                    <h2 className="text-lg font-semibold">Course Categories</h2>
                    <p className="text-blue-100 text-sm">
                      {categories.length} categories available
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Category
                </Button>
              </div>
            </div>

            {/* Categories Content */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner size="lg" />
                  <span className="ml-4 text-gray-600 dark:text-gray-300">
                    Loading categories...
                  </span>
                </div>
              ) : (
                <CategoryList
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                  onCategoryUpdate={fetchCategories}
                />
              )}
            </div>
          </div>

          {/* Right Panel - Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
            {/* Courses Header */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedCategory ? `Courses in "${selectedCategory.name}"` : 'Select a Category'}
                    </h2>
                    <p className="text-green-100 text-sm">
                      {selectedCategory 
                        ? `${courses.length} courses found`
                        : 'Choose a category to view courses'
                      }
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCourseModal(true)}
                  disabled={!selectedCategory}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Course
                </Button>
              </div>
            </div>

            {/* Courses Content */}
            <div className="flex-1 overflow-hidden">
              {!selectedCategory ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <FolderPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Category Selected
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Select a category from the left panel to view its courses
                    </p>
                  </div>
                </div>
              ) : coursesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner size="lg" />
                  <span className="ml-4 text-gray-600 dark:text-gray-300">
                    Loading courses...
                  </span>
                </div>
              ) : (
                <CourseList
                  courses={courses}
                  selectedCategory={selectedCategory}
                  onCourseUpdate={() => fetchCoursesByCategory(selectedCategory.id)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddCategoryModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onCategoryCreated={handleCategoryCreated}
          categories={categories}
        />

        <AddCourseModal
          isOpen={showCourseModal}
          onClose={() => setShowCourseModal(false)}
          onCourseCreated={handleCourseCreated}
          selectedCategory={selectedCategory}
        />
      </div>
    </DashboardLayout>
  );
};

export default AddCategoryPage;