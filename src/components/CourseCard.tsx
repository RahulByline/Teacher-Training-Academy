import React, { useState } from 'react';
import { Course } from '../types';
import { BookOpen, Clock, User, Star, Users, Calendar } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getRandomGradient = () => {
    const gradients = [
      'bg-gradient-to-br from-blue-500 to-purple-600',
      'bg-gradient-to-br from-green-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-teal-500 to-cyan-600',
      'bg-gradient-to-br from-indigo-500 to-blue-600',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; // Prevent infinite loop
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getImageUrl = () => {
    if (course.courseimage) {
      // Add token to Moodle file URLs if needed
      if (course.courseimage.includes('pluginfile.php') && !course.courseimage.includes('token=')) {
        return `${course.courseimage}&token=4a2ba2d6742afc7d13ce4cf486ba7633`;
      }
      return course.courseimage;
    }
    return '/images/default-course.svg';
  };

  const imageUrl = getImageUrl();
  const showImage = imageUrl && !imageError;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className={`h-48 relative overflow-hidden ${!showImage ? getRandomGradient() : ''}`}>
        {showImage ? (
          <>
            <img
              src={imageUrl}
              onError={handleImageError}
              onLoad={handleImageLoad}
              alt={course.fullname}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="w-12 h-12 text-white z-10" />
          </div>
        )}
        
        {/* Overlay with course info */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Course badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.type && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {course.type}
            </span>
          )}
          {course.level && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {course.level}
            </span>
          )}
        </div>

        {/* Rating */}
        {course.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{course.rating}</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {course.fullname}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 font-medium">
          {course.shortname}
        </p>
        
        {course.summary && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {course.summary.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>
        )}
        
        {/* Course stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {course.enrollmentCount && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.enrollmentCount} enrolled</span>
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
          )}
          {course.instructor && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{course.instructor}</span>
            </div>
          )}
        </div>

        {/* Category */}
        {course.categoryname && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4" />
            <span>{course.categoryname}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>ID: {course.id}</span>
            </div>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
            View Course
          </button>
        </div>
        
        {course.progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};