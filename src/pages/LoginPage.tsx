import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { UserRole } from '../types';
import { 
  User, 
  Lock, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft,
  Shield,
  GraduationCap,
  Users,
  Building,
  Network
} from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const roleIcons = {
  'super-admin': Shield,
  'school': Building,
  'trainer': Users,
  'trainee': GraduationCap,
  'cluster-lead': Network
};

const roleColors = {
  'super-admin': 'from-red-500 to-red-600',
  'school': 'from-purple-500 to-purple-600',
  'trainer': 'from-green-500 to-green-600',
  'trainee': 'from-blue-500 to-blue-600',
  'cluster-lead': 'from-orange-500 to-orange-600'
};

export const LoginPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roleKey = role as keyof typeof roleIcons;
  const RoleIcon = roleIcons[roleKey] || User;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const user = await apiService.authenticateUser(username, password);
      if (user) {
        // Validate role access
        const userRole = user.role;
        const allowedRoles = {
          'super-admin': ['admin'],
          'school': ['principal', 'manager'],
          'trainer': ['trainer'],
          'trainee': ['teacher', 'student'],
          'cluster-lead': ['cluster_lead']
        };

        if (allowedRoles[roleKey]?.includes(userRole || '')) {
          setSuccess(`${t('welcome')}, ${user.firstname}!`);
          login(user);
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          setError('Access denied. You do not have permission to access this role.');
        }
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${roleColors[roleKey] || 'from-blue-600 to-purple-600'} p-6 text-center relative`}>
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-4xl mb-3">
            <RoleIcon className="w-12 h-12 text-white mx-auto" />
          </div>
          
          <div className="mb-2">
            <img
              src="/logo-BYbhmxQK-removebg-preview.png"
              alt="Riyada Logo"
              className="h-8 w-8 mx-auto mb-2"
            />
            <div className="text-sm font-bold text-white">تدريب ريادة</div>
            <div className="text-xs text-blue-100">RIYADA TRAININGS</div>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-1">
            {t('loginTitle')}
          </h2>
          
          <p className="text-blue-100 text-sm capitalize">
            {role?.replace('-', ' ')} Access
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('username')}
              </label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                icon={User}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('password')}
              </label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={Lock}
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{success}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${roleColors[roleKey] || 'from-blue-600 to-purple-600'}`}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Logging in...</span>
                </>
              ) : (
                t('loginBtn')
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm block">
              {t('lostPassword')}
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('firstTime')}{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                {t('createAccount')}
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};