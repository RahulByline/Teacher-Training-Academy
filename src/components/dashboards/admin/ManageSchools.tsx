import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Plus, 
  Edit, 
  Settings, 
  Users, 
  UserCheck, 
  Shield, 
  Upload, 
  Mail,
  BarChart3,
  Search,
  Filter,
  Eye,
  Trash2,
  Download,
  RefreshCw,
  Globe,
  MapPin,
  Phone,
  Calendar
} from 'lucide-react';
import { LoadingSpinner } from '../../LoadingSpinner';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { schoolsService } from '../../../services/schoolsService';
import { School } from '../../../types';

interface SchoolFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  color: string;
  count?: number;
  isActive?: boolean;
}

export const ManageSchools: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState<'features' | 'schools'>('features');

  const schoolFeatures: SchoolFeature[] = [
    {
      id: 'create',
      title: 'Create School',
      description: 'Add new educational institutions to the system',
      icon: Plus,
      route: '/school/create',
      color: 'from-green-500 to-emerald-600',
      isActive: true
    },
    {
      id: 'edit',
      title: 'Edit School',
      description: 'Modify existing school information and settings',
      icon: Edit,
      route: '/school/edit',
      color: 'from-blue-500 to-cyan-600',
      isActive: true
    },
    {
      id: 'advanced',
      title: 'Advanced School Settings',
      description: 'Configure advanced parameters and integrations',
      icon: Settings,
      route: '/school/advanced',
      color: 'from-purple-500 to-violet-600',
      isActive: true
    },
    {
      id: 'manage',
      title: 'Manage Schools',
      description: 'View and organize all registered schools',
      icon: Building,
      route: '/school/manage',
      color: 'from-orange-500 to-red-600',
      count: schools.length,
      isActive: true
    },
    {
      id: 'departments',
      title: 'Manage Departments',
      description: 'Organize school departments and hierarchies',
      icon: Users,
      route: '/school/departments',
      color: 'from-teal-500 to-cyan-600',
      isActive: true
    },
    {
      id: 'profiles',
      title: 'Optional Profiles',
      description: 'Configure additional user profile fields',
      icon: UserCheck,
      route: '/school/profiles',
      color: 'from-indigo-500 to-purple-600',
      isActive: true
    },
    {
      id: 'capabilities',
      title: 'Restrict Capabilities',
      description: 'Manage user permissions and access controls',
      icon: Shield,
      route: '/school/capabilities',
      color: 'from-red-500 to-pink-600',
      isActive: true
    },
    {
      id: 'import',
      title: 'Import Schools',
      description: 'Bulk import schools from CSV or external sources',
      icon: Upload,
      route: '/school/import',
      color: 'from-yellow-500 to-orange-600',
      isActive: true
    },
    {
      id: 'templates',
      title: 'Email Templates',
      description: 'Customize email communications for schools',
      icon: Mail,
      route: '/school/templates',
      color: 'from-pink-500 to-rose-600',
      isActive: true
    }
  ];

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const schoolsData = await schoolsService.getAllSchools();
      setSchools(schoolsData);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureClick = (feature: SchoolFeature) => {
    if (feature.isActive) {
      navigate(feature.route);
    }
  };

  const filteredSchools = schools.filter(school =>
    (school.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.shortname ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.country ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderFeaturesView = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Schools Management Center
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive school administration and management tools
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={selectedView === 'features' ? 'primary' : 'outline'}
            onClick={() => setSelectedView('features')}
          >
            <Settings className="w-4 h-4" />
            Features
          </Button>
          <Button
            variant={selectedView === 'schools' ? 'primary' : 'outline'}
            onClick={() => setSelectedView('schools')}
          >
            <Building className="w-4 h-4" />
            Schools ({schools.length})
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Schools</p>
              <p className="text-3xl font-bold">{schools.length}</p>
            </div>
            <Building className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Schools</p>
              <p className="text-3xl font-bold">{schools.filter(s => s.status === 'active').length}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Countries</p>
              <p className="text-3xl font-bold">{new Set(schools.map(s => s.country)).size}</p>
            </div>
            <Globe className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Recent Additions</p>
              <p className="text-3xl font-bold">12</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schoolFeatures.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => handleFeatureClick(feature)}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group ${
              !feature.isActive ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {/* Gradient Header */}
            <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
            
            <div className="p-6">
              {/* Icon and Title */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  {feature.count !== undefined && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {feature.count} items
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  feature.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {feature.isActive ? 'Available' : 'Coming Soon'}
                </span>
                <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSchoolsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Schools Directory
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {filteredSchools.length} of {schools.length} schools
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={fetchSchools} variant="outline">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => navigate('/school/create')}>
            <Plus className="w-4 h-4" />
            Add School
          </Button>
        </div>
      </div>

      {/* Schools Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-4 text-gray-600 dark:text-gray-300">Loading schools...</span>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No schools found' : 'No schools available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first school'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => navigate('/school/create')}>
              <Plus className="w-4 h-4" />
              Add First School
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school, index) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* School Header */}
              <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                {school.logo ? (
                  <img
                    src={school.logo}
                    alt={school.name}
                    className="h-20 w-auto mx-auto object-contain bg-white rounded-lg p-2 mt-6"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building className="w-16 h-16 text-white opacity-80" />
                  </div>
                )}
                
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    school.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {school.status || 'unknown'}
                  </span>
                </div>
              </div>

              {/* School Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {school.name}
                </h3>
                
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                  {school.shortname}
                </p>
                
                {school.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {school.description}
                  </p>
                )}

                {/* School Meta */}
                <div className="space-y-2 mb-4">
                  {school.country && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{school.country}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/school/edit/${school.id}`)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/school/view/${school.id}`)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {selectedView === 'features' ? renderFeaturesView() : renderSchoolsView()}
    </div>
  );
};