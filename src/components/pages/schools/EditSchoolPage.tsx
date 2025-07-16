import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { LoadingSpinner } from '../../LoadingSpinner';
import { schoolsService } from '../../../services/schoolsService';
import { School } from '../../../types';
import { toast } from '../../ui/Toaster';
 
export const EditSchoolPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [school, setSchool] = useState<Partial<School> | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
 
  useEffect(() => {
    const fetchSchoolData = async () => {
      if (id) {
        try {
          const currentSchool = await schoolsService.getSchoolById(parseInt(id));
          if (currentSchool) {
            setSchool(currentSchool);
          } else {
            toast.error(`School with ID ${id} not found.`);
            navigate('/school');
          }
        } catch (error) {
          console.error('Failed to fetch school data', error);
          toast.error('Failed to load school data.');
        }
      }
      setLoading(false);
    };
 
    fetchSchoolData();
  }, [id, navigate]);
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (school) {
      setSchool({ ...school, [e.target.name]: e.target.value });
    }
  };
 
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };
 
  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFaviconFile(e.target.files[0]);
    }
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !school) return;
 
    try {
      await schoolsService.updateSchool(
        parseInt(id),
        school,
        logoFile || undefined,
        faviconFile || undefined
      );
 
      toast.success('School updated successfully!');
      navigate('/school');
    } catch (error) {
      console.error('Failed to update school', error);
      toast.error('Failed to update school.');
    }
  };
 
 
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading school data...</span>
      </div>
    );
  }
 
  if (!school) {
    return <div>School not found.</div>;
  }
 
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/school')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Schools
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {id ? 'Edit School' : 'View School'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {id ? 'Modify school information' : 'View school details'}
            </p>
          </div>
        </div>
      </div>
 
      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
         
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School Name</label>
            <Input
              id="name"
              name="name"
              value={school.name || ''}
              onChange={handleInputChange}
              placeholder="e.g., Acme University"
            />
          </div>
          <div>
            <label htmlFor="shortname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Name</label>
            <Input
              id="shortname"
              name="shortname"
              value={school.shortname || ''}
              onChange={handleInputChange}
              placeholder="e.g., AU"
            />
          </div>
 
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Logo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="logo-upload"
                        className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleLogoChange} accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    {logoFile && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{logoFile.name}</p>}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Favicon
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="favicon-upload"
                        className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input id="favicon-upload" name="favicon-upload" type="file" className="sr-only" onChange={handleFaviconChange} accept="image/x-icon, image/vnd.microsoft.icon, image/svg+xml, image/png" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ICO, SVG, PNG</p>
                    {faviconFile && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{faviconFile.name}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/school')}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  );
};