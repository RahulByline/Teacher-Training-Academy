import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Building,
  Users,
  Save,
  X,
  Eye,
  EyeOff,
  Globe,
  Phone
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { usersService } from '../../services/usersService';
import { schoolsService } from '../../services/schoolsService';
import { toast } from '../ui/Toaster';
import countries, { Country } from '../../utils/countries';
 
interface CreateUserFormProps {
  onUserCreated: () => void;
}
 
export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onUserCreated }) => {
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    country: '',
    city: '',
    school: '', // New: for school selection
    phone1: '',
    phone2: '',
    address: '',
    lang: 'en',
    timezone: '99',
    description: '',
    maildisplay: 2,
    mailformat: 1,
    auth: 'manual',
    createpassword: 0,
    role: '', // Will be set from real roles
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
 
  useEffect(() => {
    fetchSchools();
    fetchRoles();
    fetchDepartments();
  }, []);
 
  const fetchSchools = async () => {
    try {
      const schoolsData = await schoolsService.getAllSchools();
      setSchools(schoolsData);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };
 
  const fetchRoles = async () => {
    try {
      const rolesData = await usersService.getUserRoles();
      // Filter out dangerous roles
      setRoles(rolesData.filter(r => !['admin', 'superadmin', 'siteadmin', 'manager'].includes(r.toLowerCase())));
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };
 
  const fetchDepartments = async () => {
    try {
      const departmentsData = await usersService.getDepartments();
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
 
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
 
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
   
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
   
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
   
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }
   
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }
   
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    if (!validateForm()) {
      return;
    }
 
    setLoading(true);
    try {
      // Remove institution from payload
      const userPayload = { ...formData };
      const userRes = await usersService.createUser(userPayload);
 
      // Check for error in response
      if (!userRes || userRes.exception || !userRes[0] || !userRes[0].id) {
        const errorMsg = userRes && userRes.message
          ? userRes.message.replace(/<[^>]+>/g, '') // Remove HTML tags if present
          : 'Failed to create user. Please check the details and try again.';
        toast.error(errorMsg);
        setLoading(false);
        return;
      }
 
      const userId = userRes[0].id;
      // Assign to school if selected
      if (formData.school && userId) {
        await usersService.assignUsersToSchool([
          { userid: parseInt(userId, 10), companyid: parseInt(formData.school, 10), departmentid: 0, managertype: 0, educator: 0 }
        ]);
      }
      // Assign role in company context (if needed, pseudo-code, depends on your API)
      // await usersService.assignRoleToUser({ userid: userId, role: formData.role, companyid: formData.school });
      toast.success('User created and assigned successfully!');
      onUserCreated();
      setFormData({
        username: '', password: '', firstname: '', lastname: '', email: '', country: '', city: '', school: '', phone1: '', phone2: '', address: '', lang: 'en', timezone: '99', description: '', maildisplay: 2, mailformat: 1, auth: 'manual', createpassword: 0, role: '',
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };
 
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New User</h2>
          <p className="text-gray-600 dark:text-gray-300">Add a new user to the system</p>
        </div>
      </div>
 
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h3>
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username *
              </label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Enter username"
                icon={User}
                error={errors.username}
                required
              />
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password"
                  icon={Lock}
                  error={errors.password}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name *
              </label>
              <Input
                type="text"
                value={formData.firstname}
                onChange={(e) => handleInputChange('firstname', e.target.value)}
                placeholder="Enter first name"
                error={errors.firstname}
                required
              />
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name *
              </label>
              <Input
                type="text"
                value={formData.lastname}
                onChange={(e) => handleInputChange('lastname', e.target.value)}
                placeholder="Enter last name"
                error={errors.lastname}
                required
              />
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                icon={Mail}
                error={errors.email}
                required
              />
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <Input
                type="tel"
                value={formData.phone1}
                onChange={(e) => handleInputChange('phone1', e.target.value)}
                placeholder="Enter phone number"
                icon={Phone}
              />
            </div>
          </div>
        </div>
 
        {/* Location & Organization */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Location & Organization
          </h3>
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country *
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select country</option>
                {countries.map((c: Country) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <Input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
              />
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                School (Optional)
              </label>
              <select
                value={formData.school}
                onChange={(e) => handleInputChange('school', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select a school (optional)</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
 
        {/* Role & Settings */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Role (App Only)
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
 
        {/* Description */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Additional Information
          </h3>
         
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter user description or notes"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            />
          </div>
        </div>
 
        {/* Actions */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-emerald-600"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create User
              </>
            )}
          </Button>
         
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                username: '',
                password: '',
                firstname: '',
                lastname: '',
                email: '',
                country: '',
                city: '',
                school: '',
                phone1: '',
                phone2: '',
                address: '',
                lang: 'en',
                timezone: '99',
                description: '',
                maildisplay: 2,
                mailformat: 1,
                auth: 'manual',
                createpassword: 0,
                role: '',
              });
              setErrors({});
            }}
          >
            <X className="w-4 h-4" />
            Clear Form
          </Button>
        </div>
      </form>
    </div>
  );
};