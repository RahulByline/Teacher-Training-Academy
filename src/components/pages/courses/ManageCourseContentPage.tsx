import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { schoolsService } from '../../../services/schoolsService';
import { Button } from '../../ui/Button';
import { Plus, FileText, Link, Loader2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCourseContents, createCourseModule } from '../../../services/apiService';

interface ContentModule {
  id: number;
  name: string;
  modname: string;
  contents?: any[];
  url?: string;
  description?: string;
}

const ManageCourseContentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [modules, setModules] = useState<ContentModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'file' | 'page' | 'url'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState('');
  const [fileDesc, setFileDesc] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [urlDesc, setUrlDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const sections = await getCourseContents(courseId!);
      // Flatten all modules from all sections
      const allModules: ContentModule[] = [];
      sections.forEach((section: any) => {
        (section.modules || []).forEach((mod: any) => {
          allModules.push(mod);
        });
      });
      setModules(allModules);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch course content');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (addType === 'file') {
        if (!file || !fileTitle) throw new Error('File and title are required');
        // 1. Upload file to Moodle
        const uploaded = await schoolsService.uploadFile(file);
        if (!uploaded || !uploaded.itemid) throw new Error('File upload failed');
        // 2. Create file resource in course
        await createCourseModule({
          courseid: courseId,
          modname: 'resource',
          name: fileTitle,
          description: fileDesc,
          files: [{ itemid: uploaded.itemid, filename: uploaded.filename, filepath: uploaded.filepath }],
        });
      } else if (addType === 'page') {
        if (!pageTitle || !pageContent) throw new Error('Title and content are required');
        await createCourseModule({
          courseid: courseId,
          modname: 'page',
          name: pageTitle,
          description: '',
          pagecontent: pageContent,
        });
      } else if (addType === 'url') {
        if (!urlTitle || !urlValue) throw new Error('Title and URL are required');
        await createCourseModule({
          courseid: courseId,
          modname: 'url',
          name: urlTitle,
          description: urlDesc,
          externalurl: urlValue,
        });
      }
      setShowAddModal(false);
      setFile(null);
      setFileTitle('');
      setFileDesc('');
      setPageTitle('');
      setPageContent('');
      setUrlTitle('');
      setUrlValue('');
      setUrlDesc('');
      fetchModules();
    } catch (err: any) {
      setError(err.message || 'Failed to add content');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Course Content</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" /> Add Content
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-4 text-gray-600 dark:text-gray-300">Loading content...</span>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-8">{error}</div>
      ) : (
        <div className="space-y-4">
          {modules.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No content found for this course.</div>
          ) : (
            modules.map(mod => (
              <motion.div key={mod.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-4">
                {mod.modname === 'resource' ? <FileText className="w-6 h-6 text-blue-500" /> :
                 mod.modname === 'page' ? <FileText className="w-6 h-6 text-green-500" /> :
                 mod.modname === 'url' ? <Link className="w-6 h-6 text-purple-500" /> :
                 <FileText className="w-6 h-6 text-gray-400" />}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white">{mod.name}</div>
                  {mod.description && <div className="text-xs text-gray-500 dark:text-gray-300 line-clamp-2">{mod.description}</div>}
                  {mod.url && <a href={mod.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline">Open Link</a>}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowAddModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Add Content</h2>
            <form onSubmit={handleAddContent} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Type</label>
                <select value={addType} onChange={e => setAddType(e.target.value as any)} className="w-full border rounded px-3 py-2">
                  <option value="file">File</option>
                  <option value="page">Page</option>
                  <option value="url">URL</option>
                </select>
              </div>
              {addType === 'file' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">File</label>
                    <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input type="text" value={fileTitle} onChange={e => setFileTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea value={fileDesc} onChange={e => setFileDesc(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                </>
              )}
              {addType === 'page' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input type="text" value={pageTitle} onChange={e => setPageTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Content</label>
                    <textarea value={pageContent} onChange={e => setPageContent(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[100px]" />
                  </div>
                </>
              )}
              {addType === 'url' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input type="text" value={urlTitle} onChange={e => setUrlTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">URL</label>
                    <input type="url" value={urlValue} onChange={e => setUrlValue(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea value={urlDesc} onChange={e => setUrlDesc(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                </>
              )}
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2 inline" /> : <Upload className="w-4 h-4 mr-2 inline" />} Add
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourseContentPage; 