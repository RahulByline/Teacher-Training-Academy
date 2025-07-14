import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Building, 
  Upload, 
  Download, 
  CheckCircle,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  Trash2,
  Eye,
  Settings,
  Clock
} from 'lucide-react';
import { LoadingSpinner } from '../../LoadingSpinner';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { CreateUserForm } from '../../users/CreateUserForm';
import { EditUsersTable } from '../../users/EditUsersTable';
import { DepartmentUsersPanel } from '../../users/DepartmentUsersPanel';
import { AssignUserToSchool } from '../../users/AssignUserToSchool';
import { UploadUsersForm } from '../../users/UploadUsersForm';
import { BulkDownloadPanel } from '../../users/BulkDownloadPanel';
import { ApproveTrainingEvents } from '../../users/ApproveTrainingEvents';
import { usersService } from '../../../services/usersService';
import { toast } from '../../ui/Toaster';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  departmentManagers: number;
  recentUploads: number;
}

export const UsersDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    departmentManagers: 0,
    recentUploads: 0
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { id: 'create', label: 'Create User', icon: UserPlus, color: 'from-green-500 to-emerald-500' },
    { id: 'edit', label: 'Edit Users', icon: Edit, color: 'from-purple-500 to-violet-500' },
    { id: 'departments', label: 'Department Users', icon: Building, color: 'from-orange-500 to-red-500' },
    { id: 'assign', label: 'Assign to School', icon: Building, color: 'from-teal-500 to-cyan-500' },
    { id: 'upload', label: 'Upload Users', icon: Upload, color: 'from-indigo-500 to-purple-500' },
    { id: 'download', label: 'Bulk Download', icon: Download, color: 'from-pink-500 to-rose-500' },
    { id: 'approve', label: 'Training Events', icon: CheckCircle, color: 'from-yellow-500 to-orange-500' }
  ];

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    setLoading(true);
    try {
      const users = await usersService.getAllUsers();
      const pendingEvents = await usersService.getPendingTrainingEvents();
      
      setStats({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        pendingApprovals: pendingEvents.length,
        departmentManagers: users.filter(u => u.role === 'manager').length,
        recentUploads: Math.floor(Math.random() * 50) // Mock data
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast.error('Failed to fetch user statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchUserStats();
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { 
            label: 'Total Users', 
            value: stats.totalUsers, 
            icon: Users, 
            color: 'bg-blue-500',
            change: '+12%',
            description: 'All registered users'
          },
          { 
            label: 'Active Users', 
            value: stats.activeUsers, 
            icon: CheckCircle, 
            color: 'bg-green-500',
            change: '+8%',
            description: 'Currently active users'
          },
          { 
            label: 'Pending Approvals', 
            value: stats.pendingApprovals, 
            icon: Clock, 
            color: 'bg-orange-500',
            change: '+3',
            description: 'Training events awaiting approval'
          },
          { 
            label: 'Department Managers', 
            value: stats.departmentManagers, 
            icon: Building, 
            color: 'bg-purple-500',
            change: '+2',
            description: 'Users with manager role'
          },
          { 
            label: 'Recent Uploads', 
            value: stats.recentUploads, 
            icon: Upload, 
            color: 'bg-teal-500',
            change: '+15',
            description: 'Users uploaded this month'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </span>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                {stat.label}
              </h3>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {stat.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {stat.change}
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-600" />
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'create', label: 'Create New User', icon: UserPlus, color: 'from-green-500 to-emerald-600' },
            { id: 'upload', label: 'Bulk Upload', icon: Upload, color: 'from-blue-500 to-cyan-600' },
            { id: 'download', label: 'Export Users', icon: Download, color: 'from-purple-500 to-violet-600' },
            { id: 'approve', label: 'Approve Events', icon: CheckCircle, color: 'from-orange-500 to-red-600' }
          ].map((action) => (
            <Button
              key={action.id}
              onClick={() => setActiveTab(action.id)}
              className={`bg-gradient-to-r ${action.color} justify-start h-auto p-4 group`}
            >
              <div className="flex items-center gap-3">
                <action.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-semibold">{action.label}</div>
                  <div className="text-xs opacity-90">Click to access</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Recent User Activity
        </h3>
        
        <div className="space-y-4">
          {[
            { action: 'User created', user: 'John Doe', time: '2 minutes ago', type: 'create' },
            { action: 'Bulk upload completed', user: 'System', time: '15 minutes ago', type: 'upload' },
            { action: 'User role updated', user: 'Jane Smith', time: '1 hour ago', type: 'edit' },
            { action: 'Training event approved', user: 'Mike Johnson', time: '2 hours ago', type: 'approve' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'create' ? 'bg-green-500' :
                activity.type === 'upload' ? 'bg-blue-500' :
                activity.type === 'edit' ? 'bg-purple-500' :
                'bg-orange-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {activity.user}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'create':
        return <CreateUserForm onUserCreated={fetchUserStats} />;
      case 'edit':
        return <EditUsersTable onUserUpdated={fetchUserStats} />;
      case 'departments':
        return <DepartmentUsersPanel />;
      case 'assign':
        return <AssignUserToSchool />;
      case 'upload':
        return <UploadUsersForm onUploadComplete={fetchUserStats} />;
      case 'download':
        return <BulkDownloadPanel />;
      case 'approve':
        return <ApproveTrainingEvents onEventApproved={fetchUserStats} />;
      default:
        return renderOverview();
    }
  };

  if (loading && activeTab === 'overview') {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Comprehensive user administration and management tools
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};