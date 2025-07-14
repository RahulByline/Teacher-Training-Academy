import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { Building, Users, MapPin, ChevronRight, Globe, Mail, Phone } from 'lucide-react';
import { LoadingSpinner } from '../LoadingSpinner';
import { School } from '../../types';
import { getAllCompanies } from '../../services/apiService';

export const SchoolsSection: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      setError(null);
      try {
        const companies = await getAllCompanies();
        // Map to your School interface if needed, or use as is
        setSchools(companies);
      } catch (error) {
        console.error('Error fetching schools:', error);
        setError('Failed to fetch schools from IOMAD API');
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  return (
    <section id="schools" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('partneredSchools')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Excellence in education across the region - {schools.length} partnered institutions
          </p>
        </motion.div>

        {error ? (
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">
              <Building className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Unable to Load Schools
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {error}. Please try again later.
            </p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
            <span className="ml-4 text-gray-600 dark:text-gray-300">Loading schools...</span>
          </div>
        ) : schools.length === 0 ? (
          <div className="text-center py-20">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Schools Available
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No partnered schools are currently available to display.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {schools.map((school, index) => (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                {/* School Logo/Header */}
                <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {school.logo ? (
                      <img
                        src={school.logo}
                        alt={school.name}
                        className="h-20 w-auto mx-auto object-contain bg-white rounded-lg p-2"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <div className="text-center text-white">
                        <Building className="w-16 h-16 mx-auto opacity-80 mb-2" />
                        <span className="text-xs">No Logo</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      school.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {school.status || 'unknown'}
                    </span>
                  </div>
                  
                  {/* Country Badge */}
                  {school.country && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-white bg-opacity-90 text-gray-800">
                        {school.country}
                      </span>
                    </div>
                  )}
                </div>

                {/* School Content */}
                <div className="p-6">
                  <h3 className="text-center font-bold text-lg text-gray-900 mb-2">
                    {school.name}
                  </h3>
                  
                  <p className="text-center text-sm text-blue-600 mb-3">
                    {school.shortname}
                  </p>
                  
                  {school.description && (
                    <p className="text-center text-sm text-gray-600 mb-4">
                      {school.description || 'No description'}
                    </p>
                  )}

                  <button className="mt-2 block mx-auto text-sm text-blue-600 underline hover:text-blue-800 transition-colors">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button - Only show if there are schools */}
        {schools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 px-8 py-4 rounded-full font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300"
            >
              View All Schools ({schools.length})
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};