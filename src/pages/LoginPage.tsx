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
import LoginLayout from '../components/ui/LoginLayout';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

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
          'school': ['principal', 'manager', 'school_admin', 'companymanager', ],
          'trainer': ['trainer'],
          'trainee': ['teacher', 'student'],
          'cluster-lead': ['cluster_admin']
        };

        if (allowedRoles[roleKey]?.includes(userRole || '')) {
          setSuccess(`${t('welcome')}, ${user.firstname}!`);
          login(user);
          setTimeout(() => {
            if (userRole === 'school_admin') {
              navigate('/school-admin-dashboard');
            } else {
              navigate('/dashboard');
            }
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
    <LoginLayout
      leftContent={
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-5xl font-bold mb-4">Welcome<br />Back</h1>
          <p className="mb-6 max-w-md text-lg opacity-90">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using</p>
          <div className="flex space-x-4 mb-2">
            <a href="#" aria-label="Facebook" className="hover:text-blue-400"><FaFacebookF size={24} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-400"><FaTwitter size={24} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-400"><FaInstagram size={24} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-red-500"><FaYoutube size={24} /></a>
          </div>
        </div>
      }
      rightContent={
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email"
                icon={User}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
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
            <div className="flex items-center mb-2">
              <input id="remember" name="remember" type="checkbox" className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
              <label htmlFor="remember" className="ml-2 block text-sm text-white">
                Remember Me
              </label>
            </div>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{success}</span>
              </motion.div>
            )}
            <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold">
              {loading ? (<><LoadingSpinner size="sm" /><span>Logging in...</span></>) : 'Sign in now'}
            </Button>
          </form>
          <div className="mt-4 flex flex-col items-start">
  <a href="#" className="text-sm text-white hover:underline mb-2">Lost your password?</a>
  <p className="text-xs text-white mt-2">
    By clicking on "Sign in now" you agree to 
    <a href="#" className="underline ml-1">Terms of Service</a> | 
    <a href="#" className="underline ml-1">Privacy Policy</a>
  </p>
</div>
        </div>
      }
    />
  );
};