import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { schoolsService } from '../../../services/schoolsService';
import { Button } from '../../ui/Button';
import { Plus, FileText, Link, Loader2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCourseContents } from '../../../services/apiService';
import * as contentBuilderService from '../../../services/contentBuilderService';

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
  type ActivityType = 'resource' | 'page' | 'url' | 'folder' | 'scorm' | 'assignment' | 'quiz' | 'label';
  const [addType, setAddType] = useState<ActivityType>('resource');
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
  const [folderFiles, setFolderFiles] = useState<File[]>([]);
  const [labelText, setLabelText] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [scormFile, setScormFile] = useState<File | null>(null);
  const [scormTitle, setScormTitle] = useState('');
  const [scormDesc, setScormDesc] = useState('');
  // Add state for sections and selectedSection
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<number>(0);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionSummary, setNewSectionSummary] = useState('');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchJson, setBatchJson] = useState('');
  const [batchError, setBatchError] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const sectionData = await getCourseContents(courseId!);
      setSections(sectionData);
      // Flatten all modules from all sections
      const allModules: ContentModule[] = [];
      sectionData.forEach((section: any) => {
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
      if (addType === 'resource') {
        if (!file || !fileTitle) throw new Error('File and title are required');
        const uploaded = await schoolsService.uploadFile(file);
        if (!uploaded || !uploaded.itemid) throw new Error('File upload failed');
        await contentBuilderService.addActivity(Number(courseId), selectedSection, 'resource', fileTitle, [
          { name: 'description', value: fileDesc },
          { name: 'files', value: JSON.stringify([{ itemid: uploaded.itemid, filename: uploaded.filename, filepath: uploaded.filepath }]) },
        ]);
      } else if (addType === 'page') {
        if (!pageTitle || !pageContent) throw new Error('Title and content are required');
        await contentBuilderService.addActivity(Number(courseId), selectedSection, 'page', pageTitle, [
          { name: 'description', value: '' },
          { name: 'pagecontent', value: pageContent },
        ]);
      } else if (addType === 'url') {
        if (!urlTitle || !urlValue) throw new Error('Title and URL are required');
        await contentBuilderService.addActivity(Number(courseId), selectedSection, 'url', urlTitle, [
          { name: 'description', value: urlDesc },
          { name: 'externalurl', value: urlValue },
        ]);
      } else if (addType === 'folder') {
        if (!folderFiles.length) throw new Error('At least one file is required');
        // Upload all files
        const uploadedFiles = await Promise.all(folderFiles.map(f => schoolsService.uploadFile(f)));
        await contentBuilderService.addActivity(Number(courseId), selectedSection, 'folder', fileTitle, [
          { name: 'description', value: fileDesc },
          { name: 'files', value: JSON.stringify(uploadedFiles.map(f => ({ itemid: f.itemid, filename: f.filename, filepath: f.filepath }))) },
        ]);
      } else if (addType === 'scorm') {
        if (!scormFile || !scormTitle) throw new Error('SCORM file and title are required');
        const uploaded = await schoolsService.uploadFile(scormFile);
        if (!uploaded || !uploaded.itemid) throw new Error('SCORM upload failed');
        await contentBuilderService.addActivity(Number(courseId), selectedSection, 'scorm', scormTitle, [
          { name: 'description', value: scormDesc },
          { name: 'files', value: JSON.stringify([{ itemid: uploaded.itemid, filename: uploaded.filename, filepath: uploaded.filepath }]) },
        ]);
      } else if (addType === 'assignment') {
        if (!assignmentTitle) throw new Error('Assignment title is required');
        await contentBuilderService.addActivity(Number(courseId), selectedSection, 'assign', assignmentTitle, [
          { name: 'description', value: assignmentDesc },
        ]);
      } else if (addType === 'quiz') {
        if (!quizTitle) throw new Error('Quiz title is required');
        await contentBuilderService.addActivity(Number(courseId), selectedSection, 'quiz', quizTitle, [
          { name: 'description', value: quizDesc },
        ]);
      } else if (addType === 'label') {
        if (!labelText) throw new Error('Label text is required');
        await contentBuilderService.addActivity(Number(courseId), selectedSection, 'label', 'Label', [
          { name: 'description', value: labelText },
        ]);
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
      setFolderFiles([]);
      setLabelText('');
      setAssignmentTitle('');
      setAssignmentDesc('');
      setQuizTitle('');
      setQuizDesc('');
      setScormFile(null);
      setScormTitle('');
      setScormDesc('');
      fetchModules();
    } catch (err: any) {
      setError(err.message || 'Failed to add content');
    } finally {
      setSubmitting(false);
    }
  };

  // Add section creation handler
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await contentBuilderService.createSection(Number(courseId), newSectionName, newSectionSummary);
      setShowSectionModal(false);
      setNewSectionName('');
      setNewSectionSummary('');
      fetchModules();
    } catch (err: any) {
      setError(err.message || 'Failed to create section');
    } finally {
      setSubmitting(false);
    }
  };

  // Add batch import handler
  const handleBatchImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setBatchError(null);
    try {
      await contentBuilderService.batchImport(Number(courseId), JSON.parse(batchJson));
      setShowBatchModal(false);
      setBatchJson('');
      fetchModules();
    } catch (err: any) {
      setBatchError(err.message || 'Failed to batch import');
    } finally {
      setSubmitting(false);
    }
  };

  const activityTypes = [
    { value: 'resource', label: 'File' },
    { value: 'page', label: 'Page' },
    { value: 'url', label: 'URL' },
    { value: 'folder', label: 'Folder' },
    { value: 'scorm', label: 'SCORM Package' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'label', label: 'Label' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Course Content</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" /> Add Content
        </Button>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={() => setShowSectionModal(true)} variant="outline">+ New Section</Button>
        <Button onClick={() => setShowBatchModal(true)} variant="outline">Batch Import</Button>
        <label className="ml-4 font-medium">Section:</label>
        <select value={selectedSection} onChange={e => setSelectedSection(Number(e.target.value))} className="border rounded px-2 py-1">
          {sections.map(section => (
            <option key={section.id} value={section.section}>{section.name || `Section ${section.section}`}</option>
          ))}
        </select>
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
                <select value={addType} onChange={e => setAddType(e.target.value as ActivityType)} className="w-full border rounded px-3 py-2">
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              {addType === 'resource' && (
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
              {addType === 'folder' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Files</label>
                    <input type="file" multiple onChange={e => setFolderFiles(Array.from(e.target.files || []))} className="w-full" />
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
              {addType === 'scorm' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">SCORM File (.zip)</label>
                    <input type="file" accept=".zip" onChange={e => setScormFile(e.target.files?.[0] || null)} className="w-full" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input type="text" value={scormTitle} onChange={e => setScormTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea value={scormDesc} onChange={e => setScormDesc(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                </>
              )}
              {addType === 'assignment' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input type="text" value={assignmentTitle} onChange={e => setAssignmentTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea value={assignmentDesc} onChange={e => setAssignmentDesc(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                </>
              )}
              {addType === 'quiz' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input type="text" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea value={quizDesc} onChange={e => setQuizDesc(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                </>
              )}
              {addType === 'label' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">Label Text</label>
                    <textarea value={labelText} onChange={e => setLabelText(e.target.value)} className="w-full border rounded px-3 py-2" />
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
      {/* Add modal for creating section */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowSectionModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Create New Section</h2>
            <form onSubmit={handleCreateSection} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Section Name</label>
                <input type="text" value={newSectionName} onChange={e => setNewSectionName(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Summary</label>
                <textarea value={newSectionSummary} onChange={e => setNewSectionSummary(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">Create Section</Button>
            </form>
          </div>
        </div>
      )}
      {/* Add modal for batch import */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowBatchModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Batch Import</h2>
            <form onSubmit={handleBatchImport} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">JSON Structure</label>
                <textarea value={batchJson} onChange={e => setBatchJson(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[120px]" placeholder='[{"section": {"name": "Section 1"}, "activities": [{"modname": "page", "name": "Page 1", "options": [{"name": "pagecontent", "value": "..."}]}]}]'></textarea>
              </div>
              {batchError && <div className="text-red-600 text-sm">{batchError}</div>}
              <Button type="submit" disabled={submitting} className="w-full">Import</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourseContentPage; 