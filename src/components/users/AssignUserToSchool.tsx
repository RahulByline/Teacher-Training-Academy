import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Users, 
  Search, 
  ArrowRight, 
  Check, 
  X,
  UserPlus,
  School
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { usersService } from '../../services/usersService';
import { schoolsService } from '../../services/schoolsService';
import { toast } from '../ui/Toaster';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  currentSchool?: string;
  currentSchoolName?: string;
}

interface School {
  id: string;
  name: string;
  shortname: string;
  userCount: number;
  country: string;
  city: string;
}

export const AssignUserToSchool: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [schoolSearchTerm, setSchoolSearchTerm] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, userSearchTerm]);

  useEffect(() => {
    filterSchools();
  }, [schools, schoolSearchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, schoolsData] = await Promise.all([
        usersService.getAllUsers(),
        schoolsService.getAllSchools()
      ]);
      setUsers(usersData);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;
    if (userSearchTerm) {
      filtered = filtered.filter(user =>
        user.firstname.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  };

  const filterSchools = () => {
    let filtered = schools;
    if (schoolSearchTerm) {
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
        school.shortname.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
        school.country.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(schoolSearchTerm.toLowerCase())
      );
    }
    setFilteredSchools(filtered);
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const assignUsersToSchool = async () => {
    if (selectedUsers.size === 0 || !selectedSchool) {
      toast.error('Please select users and a school');
      return;
    }

    setAssigning(true);
    try {
      await usersService.assignUsersToSchool(Array.from(selectedUsers), selectedSchool.id);
      toast.success(`${selectedUsers.size} users assigned to ${selectedSchool.name}`);
      setSelectedUsers(new Set());
      setSelectedSchool(null);
      fetchData();
    } catch (error) {
      console.error('Error assigning users:', error);
      toast.error('Failed to assign users to school');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <Building className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assign Users to School</h2>
          <p className="text-gray-600 dark:text-gray-300">Assign users to specific schools and institutions</p>
        </div>
      </div>

      {/* Assignment Summary */}
      {(selectedUsers.size > 0 || selectedSchool) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <span className="font-medium text-teal-700 dark:text-teal-300">
                  {selectedUsers.size} users selected
                </span>
              </div>
              
              {selectedUsers.size > 0 && selectedSchool && (
                <>
                  <ArrowRight className="w-5 h-5 text-teal-600" />
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-teal-600" />
                    <span className="font-medium text-teal-700 dark:text-teal-300">
                      {selectedSchool.name}
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <Button
              onClick={assignUsersToSchool}
              disabled={selectedUsers.size === 0 || !selectedSchool || assigning}
              className="bg-gradient-to-r from-teal-600 to-cyan-600"
            >
              {assigning ? (
                <>
                  <LoadingSpinner size="sm" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Assign Users
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Select Users</h3>
                <p className="text-blue-100 text-sm">{filteredUsers.length} users available</p>
              </div>
              <Users className="w-6 h-6 text-blue-200" />
            </div>
          </div>
          
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedUsers.has(user.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {user.firstname} {user.lastname}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                        {user.currentSchoolName && (
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            Currently: {user.currentSchoolName}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full capitalize">
                        {user.role}
                      </span>
                      {selectedUsers.has(user.id) && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Schools Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Select School</h3>
                <p className="text-green-100 text-sm">{filteredSchools.length} schools available</p>
              </div>
              <School className="w-6 h-6 text-green-200" />
            </div>
          </div>
          
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search schools..."
                value={schoolSearchTerm}
                onChange={(e) => setSchoolSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredSchools.map((school) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedSchool?.id === school.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500'
                  }`}
                  onClick={() => setSelectedSchool(school)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {school.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {school.shortname}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {school.city}, {school.country}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                        {school.userCount} users
                      </span>
                      {selectedSchool?.id === school.id && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredSchools.length === 0 && (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">No schools found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};