import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Building, 
  Save, 
  X,
  MapPin,
  Globe,
  Phone,
  Mail,
  Users,
  Palette,
  Settings
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { LoadingSpinner } from '../../LoadingSpinner';
import { schoolsService } from '../../../services/schoolsService';
import { toast } from '../../ui/Toaster';

export const CreateSchoolPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    name: '',
    shortname: '',
    description: '',
    country: '',
    city: '',
    address: '',
    region: '',
    postcode: '',
    phone: '',
    email: '',
    website: '',
    theme: '',
    hostname: '',
    maxUsers: '',
    mainColor: '#3b82f6',
    headingColor: '#1e40af',
    linkColor: '#2563eb',
    customCss: '',
    custom1: '',
    custom2: '',
    custom3: ''
  });

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: Building },
    { id: 'location', label: 'Location & Contact', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await schoolsService.createSchool({
        name: formData.name,
        shortname: formData.shortname,
        description: formData.description,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        region: formData.region,
        postcode: formData.postcode,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        theme: formData.theme,
        hostname: formData.hostname,
        maxUsers: formData.maxUsers ? parseInt(formData.maxUsers) : undefined,
        mainColor: formData.mainColor,
        headingColor: formData.headingColor,
        linkColor: formData.linkColor,
        customCss: formData.customCss,
        custom1: formData.custom1,
        custom2: formData.custom2,
        custom3: formData.custom3,
        status: 'active'
      });

      toast.success('School created successfully!');
      navigate('/school');
    } catch (error) {
      toast.error('Failed to create school. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderBasicTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            School Name *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter school name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Short Name *
          </label>
          <Input
            type="text"
            value={formData.shortname}
            onChange={(e) => handleInputChange('shortname', e.target.value)}
            placeholder="Enter short name"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter school description"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
    </div>
  );

  const renderLocationTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country *
          </label>
          <Input
            type="text"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            placeholder="e.g., SA, US, UK"
            icon={Globe}
            required
          />
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
            icon={MapPin}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Address
        </label>
        <Input
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter full address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Region/State
          </label>
          <Input
            type="text"
            value={formData.region}
            onChange={(e) => handleInputChange('region', e.target.value)}
            placeholder="Enter region or state"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Postal Code
          </label>
          <Input
            type="text"
            value={formData.postcode}
            onChange={(e) => handleInputChange('postcode', e.target.value)}
            placeholder="Enter postal code"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
            icon={Phone}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
            icon={Mail}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Website
        </label>
        <Input
          type="url"
          value={formData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          placeholder="https://example.com"
          icon={Globe}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Webserver Hostname
        </label>
        <Input
          type="text"
          value={formData.hostname}
          onChange={(e) => handleInputChange('hostname', e.target.value)}
          placeholder="school.domain.com"
          icon={Globe}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This is the subdomain or hostname for the school in teacher training academy</p>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </label>
          <select
            value={formData.theme}
            onChange={(e) => handleInputChange('theme', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Default Theme</option>
            <option value="boost">Boost</option>
            <option value="classic">Classic</option>
            <option value="more">More</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hostname
          </label>
          <Input
            type="text"
            value={formData.hostname}
            onChange={(e) => handleInputChange('hostname', e.target.value)}
            placeholder="school.domain.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Maximum Users
        </label>
        <Input
          type="number"
          value={formData.maxUsers}
          onChange={(e) => handleInputChange('maxUsers', e.target.value)}
          placeholder="Enter maximum number of users (0 = unlimited)"
          icon={Users}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Fields</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Field 1
            </label>
            <Input
              type="text"
              value={formData.custom1}
              onChange={(e) => handleInputChange('custom1', e.target.value)}
              placeholder="Custom field 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Field 2
            </label>
            <Input
              type="text"
              value={formData.custom2}
              onChange={(e) => handleInputChange('custom2', e.target.value)}
              placeholder="Custom field 2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Field 3
            </label>
            <Input
              type="text"
              value={formData.custom3}
              onChange={(e) => handleInputChange('custom3', e.target.value)}
              placeholder="Custom field 3"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Main Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.mainColor}
              onChange={(e) => handleInputChange('mainColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <Input
              type="text"
              value={formData.mainColor}
              onChange={(e) => handleInputChange('mainColor', e.target.value)}
              placeholder="#3b82f6"
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Heading Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.headingColor}
              onChange={(e) => handleInputChange('headingColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <Input
              type="text"
              value={formData.headingColor}
              onChange={(e) => handleInputChange('headingColor', e.target.value)}
              placeholder="#1e40af"
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Link Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.linkColor}
              onChange={(e) => handleInputChange('linkColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <Input
              type="text"
              value={formData.linkColor}
              onChange={(e) => handleInputChange('linkColor', e.target.value)}
              placeholder="#2563eb"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Custom CSS
        </label>
        <textarea
          value={formData.customCss}
          onChange={(e) => handleInputChange('customCss', e.target.value)}
          placeholder="Enter custom CSS styles..."
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Color Preview</h4>
        <div className="flex gap-4">
          <div 
            className="w-16 h-16 rounded-lg border-2 border-gray-300"
            style={{ backgroundColor: formData.mainColor }}
            title="Main Color"
          ></div>
          <div 
            className="w-16 h-16 rounded-lg border-2 border-gray-300"
            style={{ backgroundColor: formData.headingColor }}
            title="Heading Color"
          ></div>
          <div 
            className="w-16 h-16 rounded-lg border-2 border-gray-300"
            style={{ backgroundColor: formData.linkColor }}
            title="Link Color"
          ></div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicTab();
      case 'location':
        return renderLocationTab();
      case 'settings':
        return renderSettingsTab();
      case 'appearance':
        return renderAppearanceTab();
      default:
        return renderBasicTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/school')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Schools
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New School
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Add a new educational institution to the system
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
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

          {/* Actions */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/school')}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.shortname || !formData.country}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create School
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};