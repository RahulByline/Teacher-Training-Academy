import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { UserRole } from '../types';
import { X, User, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: UserRole | null;
}

const roleIcons = {
  teacher: '👨‍🏫',
  trainer: '👩‍💼',
  principal: '🏫',
  cluster_lead: '🌐',
  admin: '⚡'
};

const roleColors = {
  teacher: 'from-blue-500 to-blue-600',
  trainer: 'from-green-500 to-green-600',
  principal: 'from-purple-500 to-purple-600',
  cluster_lead: 'from-orange-500 to-orange-600',
  admin: 'from-red-500 to-red-600'
};

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, selectedRole }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const user = await apiService.authenticateUser(username, password);
      if (user) {
        setSuccess(`${t('welcome')}, ${user.firstname}!`);
        login(user);
        setTimeout(() => {
          onClose();
          navigate('/dashboard');
        }, 1000);
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${selectedRole ? roleColors[selectedRole] : 'from-blue-600 to-purple-600'} p-6 text-center relative`}>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-4xl mb-3">
                {selectedRole ? roleIcons[selectedRole] : '🔐'}
              </div>
              
              <div className="mb-2">
                <div className="text-sm font-bold text-white">تدريب ريادة</div>
                <div className="text-xs text-blue-100">RIYADA TRAININGS</div>
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-1">
                {t('loginTitle')}
              </h2>
              
              {selectedRole && (
                <p className="text-blue-100 text-sm">
                  {t(selectedRole)} Dashboard Access
                </p>
              )}
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('username')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">{success}</span>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r ${selectedRole ? roleColors[selectedRole] : 'from-blue-600 to-purple-600'} text-white py-3 rounded-lg font-medium hover:shadow-lg focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    t('loginBtn')
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium text-sm block">
                  {t('lostPassword')}
                </a>
                <p className="text-sm text-gray-600">
                  {t('firstTime')}{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                    {t('createAccount')}
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};