import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Download, 
  Check, 
  X, 
  AlertTriangle,
  Info,
  File,
  Save
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { usersService } from '../../services/usersService';
import { toast } from '../ui/Toaster';

interface UploadUsersFormProps {
  onUploadComplete: () => void;
}

interface UploadResult {
  success: number;
  warnings: number;
  errors: number;
  details: {
    type: 'success' | 'warning' | 'error';
    message: string;
    line?: number;
  }[];
}

export const UploadUsersForm: React.FC<UploadUsersFormProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [showTemplate, setShowTemplate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      const result = await usersService.uploadUsers(file);
      setUploadResult(result);
      toast.success(`Successfully processed ${result.success} users`);
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading users:', error);
      toast.error('Failed to upload users');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      await usersService.downloadUserTemplate();
      toast.success('Template downloaded successfully');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Failed to download template');
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Users</h2>
          <p className="text-gray-600 dark:text-gray-300">Bulk import users via CSV file</p>
        </div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upload Instructions
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
                <span>Download the CSV template or prepare your own CSV file</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
                <span>Required columns: username, password, firstname, lastname, email</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</div>
                <span>Optional columns: role, department, school, country, city, etc.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</div>
                <span>Drag and drop your CSV file or click to browse</span>
              </li>
            </ul>
            
            <div className="mt-4">
              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="text-blue-600 border-blue-600"
              >
                <Download className="w-4 h-4" />
                Download Template
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CSV Template Preview */}
      {showTemplate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 overflow-x-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              CSV Template Format
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowTemplate(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-600">
                <th className="px-4 py-2 text-left">username</th>
                <th className="px-4 py-2 text-left">password</th>
                <th className="px-4 py-2 text-left">firstname</th>
                <th className="px-4 py-2 text-left">lastname</th>
                <th className="px-4 py-2 text-left">email</th>
                <th className="px-4 py-2 text-left">role</th>
                <th className="px-4 py-2 text-left">school</th>
                <th className="px-4 py-2 text-left">department</th>
                <th className="px-4 py-2 text-left">country</th>
                <th className="px-4 py-2 text-left">city</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-2">johndoe</td>
                <td className="px-4 py-2">Password123!</td>
                <td className="px-4 py-2">John</td>
                <td className="px-4 py-2">Doe</td>
                <td className="px-4 py-2">john.doe@example.com</td>
                <td className="px-4 py-2">student</td>
                <td className="px-4 py-2">School A</td>
                <td className="px-4 py-2">Science</td>
                <td className="px-4 py-2">US</td>
                <td className="px-4 py-2">New York</td>
              </tr>
              <tr>
                <td className="px-4 py-2">janesmith</td>
                <td className="px-4 py-2">Password456!</td>
                <td className="px-4 py-2">Jane</td>
                <td className="px-4 py-2">Smith</td>
                <td className="px-4 py-2">jane.smith@example.com</td>
                <td className="px-4 py-2">teacher</td>
                <td className="px-4 py-2">School B</td>
                <td className="px-4 py-2">Math</td>
                <td className="px-4 py-2">UK</td>
                <td className="px-4 py-2">London</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      )}

      {/* File Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600'
            } transition-colors duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {file.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpload();
                    }}
                    disabled={uploading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    {uploading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload File
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetForm();
                    }}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Drag & Drop CSV File
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  or click to browse your files
                </p>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTemplate(!showTemplate);
                  }}
                >
                  <Info className="w-4 h-4" />
                  {showTemplate ? 'Hide Template' : 'Show Template Format'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Upload Results */}
      {uploadResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
            <h3 className="text-lg font-semibold">Upload Results</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {uploadResult.success}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Successfully Processed
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {uploadResult.warnings}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Processed with Warnings
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {uploadResult.errors}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Failed to Process
                </div>
              </div>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {uploadResult.details.map((detail, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-start gap-3 ${
                    detail.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : detail.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20'
                      : 'bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  {detail.type === 'success' ? (
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : detail.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm ${
                      detail.type === 'success'
                        ? 'text-green-700 dark:text-green-300'
                        : detail.type === 'warning'
                        ? 'text-yellow-700 dark:text-yellow-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {detail.message}
                    </p>
                    {detail.line && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Line: {detail.line}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex gap-4">
              <Button onClick={resetForm}>
                <Upload className="w-4 h-4" />
                Upload Another File
              </Button>
              <Button
                variant="outline"
                onClick={() => usersService.downloadUploadResults(uploadResult)}
              >
                <Download className="w-4 h-4" />
                Download Results
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Manual User Entry */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 text-white">
          <h3 className="text-lg font-semibold">Manual User Entry</h3>
          <p className="text-green-100 text-sm">Add users one by one</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input placeholder="Username" />
            <Input placeholder="Password" type="password" />
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Role" />
            <Input placeholder="School" />
            <Input placeholder="Department" />
          </div>
          
          <div className="flex gap-4">
            <Button className="bg-gradient-to-r from-green-600 to-teal-600">
              <Save className="w-4 h-4" />
              Add User
            </Button>
            <Button variant="outline">
              <Plus className="w-4 h-4" />
              Add Another Row
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};