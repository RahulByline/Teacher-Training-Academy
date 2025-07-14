import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Users, 
  UserPlus, 
  Crown, 
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { usersService } from '../../services/usersService';
import { toast } from '../ui/Toaster';

interface Department {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  managerId?: string;
  userCount: number;
  users: User[];
  children: Department[];
}

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  isManager: boolean;
}

export const DepartmentUsersPanel: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const departmentsData = await usersService.getDepartmentsWithUsers();
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const toggleDepartment = (deptId: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  const assignManager = async (departmentId: string, userId: string) => {
    try {
      await usersService.assignDepartmentManager(departmentId, userId);
      toast.success('Manager assigned successfully');
      fetchDepartments();
    } catch (error) {
      console.error('Error assigning manager:', error);
      toast.error('Failed to assign manager');
    }
  };

  const removeUserFromDepartment = async (departmentId: string, userId: string) => {
    try {
      await usersService.removeUserFromDepartment(departmentId, userId);
      toast.success('User removed from department');
      fetchDepartments();
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Failed to remove user');
    }
  };

  const renderDepartmentTree = (dept: Department, level: number = 0) => {
    const hasChildren = dept.children && dept.children.length > 0;
    const isExpanded = expandedDepts.has(dept.id);
    const isSelected = selectedDepartment?.id === dept.id;

    return (
      <div key={dept.id}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            isSelected 
              ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => setSelectedDepartment(dept)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleDepartment(dept.id);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          )}
          
          <Building className="w-5 h-5 text-blue-500" />
          
          <div className="flex-1">
            <h3 className={`font-medium ${
              isSelected 
                ? 'text-blue-700 dark:text-blue-300' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {dept.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {dept.userCount} users
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {dept.managerId && (
              <Crown className="w-4 h-4 text-yellow-500" title="Has Manager" />
            )}
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
              {dept.userCount}
            </span>
          </div>
        </motion.div>
        
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {dept.children.map(child => renderDepartmentTree(child, level + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  const renderDepartmentUsers = () => {
    if (!selectedDepartment) {
      return (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a Department
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Choose a department from the left panel to view its users
            </p>
          </div>
        </div>
      );
    }

    const filteredUsers = selectedDepartment.users.filter(user =>
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedDepartment.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {selectedDepartment.users.length} users in this department
            </p>
          </div>
          <Button>
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {user.firstname} {user.lastname}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {user.isManager && (
                  <Crown className="w-5 h-5 text-yellow-500" title="Department Manager" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 capitalize">
                  {user.role}
                </span>
                
                <div className="flex items-center gap-1">
                  {!user.isManager && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => assignManager(selectedDepartment.id, user.id)}
                      title="Make Manager"
                    >
                      <Crown className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeUserFromDepartment(selectedDepartment.id, user.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'This department has no users assigned'
              }
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading departments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <Building className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Department Users & Managers</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage users within departments and assign managers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-400px)]">
        {/* Departments Tree */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
            <h3 className="text-lg font-semibold">Departments</h3>
            <p className="text-orange-100 text-sm">{departments.length} departments</p>
          </div>
          
          <div className="p-4 overflow-y-auto h-full">
            {departments.length === 0 ? (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">No departments found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {departments.map(dept => renderDepartmentTree(dept))}
              </div>
            )}
          </div>
        </div>

        {/* Department Users */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 h-full overflow-y-auto">
            {renderDepartmentUsers()}
          </div>
        </div>
      </div>
    </div>
  );
};