import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Filter, 
  Calendar, 
  Settings,
  Check,
  FileSpreadsheet,
  FilePdf,
  FileJson,
  FileCode
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { usersService } from '../../services/usersService';
import { schoolsService } from '../../services/schoolsService';
import { toast } from '../ui/Toaster';

export const BulkDownloadPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    school: '',
    department: '',
    role: '',
    startDate: '',
    endDate: '',
    includeDeleted: false,
    includeInactive: false
  });
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportFields, setExportFields] = useState<string[]>([
    'username', 'firstname', 'lastname', 'email', 'role', 'school', 'department'
  ]);
  const [availableFields, setAvailableFields] = useState<string[]>([
    'username', 'firstname', 'lastname', 'email', 'role', 'school', 'department',
    'country', 'city', 'lastaccess', 'firstaccess', 'suspended', 'auth', 'timezone',
    'lang', 'phone1', 'phone2', 'address', 'description'
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schoolsData, departmentsData, rolesData] = await Promise.all([
        schoolsService.getAllSchools(),
        usersService.getDepartments(),
        usersService.getUserRoles()
      ]);
      
      setSchools(schoolsData);
      setDepartments(departmentsData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch filter data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const toggleExportField = (field: string) => {
    setExportFields(prev => {
      if (prev.includes(field)) {
        return prev.filter(f => f !== field);
      } else {
        return [...prev, field];
      }
    });
  };

  const handleExport = async () => {
    if (exportFields.length === 0) {
      toast.error('Please select at least one field to export');
      return;
    }

    setLoading(true);
    try {
      await usersService.exportUsers({
        format: exportFormat,
        fields: exportFields,
        filters
      });
      toast.success('Users exported successfully');
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Failed to export users');
    } finally {
      setLoading(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv': return FileText;
      case 'xlsx': return FileSpreadsheet;
      case 'pdf': return FilePdf;
      case 'json': return FileJson;
      case 'xml': return FileCode;
      default: return FileText;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading export options...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bulk Download Users</h2>
          <p className="text-gray-600 dark:text-gray-300">Export user data in various formats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Filter Options</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                School
              </label>
              <select
                value={filters.school}
                onChange={(e) => handleFilterChange('school', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Schools</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Created Between
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    icon={Calendar}
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    icon={Calendar}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.includeDeleted}
                  onChange={(e) => handleFilterChange('includeDeleted', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Include deleted users</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.includeInactive}
                  onChange={(e) => handleFilterChange('includeInactive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Include inactive users</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Export Options Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden lg:col-span-2"
        >
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 text-white">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Export Options</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Format Selection */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Export Format
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['csv', 'xlsx', 'pdf', 'json', 'xml'].map((format) => {
                  const FormatIcon = getFormatIcon(format);
                  return (
                    <motion.div
                      key={format}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        exportFormat === format
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                      onClick={() => setExportFormat(format)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                          exportFormat === format
                            ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          <FormatIcon className="w-6 h-6" />
                        </div>
                        <span className={`text-sm font-medium uppercase ${
                          exportFormat === format
                            ? 'text-pink-600 dark:text-pink-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {format}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            {/* Field Selection */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Fields to Export
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableFields.map((field) => (
                  <label
                    key={field}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      exportFields.includes(field)
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={exportFields.includes(field)}
                      onChange={() => toggleExportField(field)}
                      className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className={`text-sm capitalize ${
                      exportFields.includes(field)
                        ? 'text-pink-600 dark:text-pink-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {field}
                    </span>
                    {exportFields.includes(field) && (
                      <Check className="w-4 h-4 text-pink-600 ml-auto" />
                    )}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Export Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleExport}
                disabled={loading || exportFields.length === 0}
                className="bg-gradient-to-r from-pink-600 to-rose-600"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export Users
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Export History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-4 text-white">
          <h3 className="text-lg font-semibold">Recent Exports</h3>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Filters
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { date: '2024-01-15', format: 'CSV', records: 245, filters: 'School A, Teachers', user: 'Admin' },
                  { date: '2024-01-10', format: 'XLSX', records: 120, filters: 'All Schools', user: 'Admin' },
                  { date: '2024-01-05', format: 'PDF', records: 85, filters: 'Department B', user: 'Admin' }
                ].map((export_, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {export_.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {export_.format}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {export_.records}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {export_.filters}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {export_.user}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};