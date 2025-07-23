import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { schoolsService } from '../../../services/schoolsService';
import { Button } from '../../ui/Button';
import { Plus, FileText, Link, Loader2, Upload, BookOpen, Tag, PlusCircle, Edit, Trash2, ChevronDown, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCourseContents } from '../../../services/apiService';
import * as contentBuilderService from '../../../services/contentBuilderService';
import DOMPurify from 'dompurify';
import axios from 'axios'; // Import axios directly


interface ContentModule {
  id: number;
  name: string;
  modname: string;
  url?: string;
  description?: string;
  pagecontent?: string;
  renderedContent?: string;
  mainUrl?: string;
  fileName?: string;
}

interface CourseSection {
    id: number;
    name: string;
    section: number;
    summary: string;
    modules: ContentModule[];
}

const ModuleDisplay: React.FC<{ module: ContentModule; onDelete: () => void; onUpdate: (newName: string) => void; }> = ({ module, onDelete, onUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false);

    const getModuleIcon = (modname: string) => {
        switch(modname) {
          case 'resource': return <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />;
          case 'page': return <BookOpen className="w-5 h-5 text-green-500 flex-shrink-0" />;
          case 'url': return <Link className="w-5 h-5 text-purple-500 flex-shrink-0" />;
          case 'label': return <Tag className="w-5 h-5 text-gray-500 flex-shrink-0" />;
          case 'assign': return <FileText className="w-5 h-5 text-pink-500 flex-shrink-0" />;
          default: return <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />;
        }
    };

    const isImage = module.fileName && /\.(jpg|jpeg|png|gif)$/i.test(module.fileName);

    useEffect(() => {
        let objectUrl: string | null = null;

        const fetchImage = async () => {
            if (isImage && module.mainUrl && isExpanded) {
                setIsLoadingImage(true);
                try {
                    // Use a direct axios call to avoid sending the Authorization header
                    const response = await axios.get(module.mainUrl, {
                        responseType: 'blob',
                        params: { token: '4a2ba2d6742afc7d13ce4cf486ba7633' }
                    });
                    objectUrl = URL.createObjectURL(response.data);
                    setImageUrl(objectUrl);
                } catch (error) {
                    console.error("Failed to fetch secure image:", error);
                    setImageUrl(null);
                } finally {
                    setIsLoadingImage(false);
                }
            }
        };

        fetchImage();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [isImage, module.mainUrl, isExpanded]);


    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 transition-shadow shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    {getModuleIcon(module.modname)}
                    <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{module.name}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-800" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-800" onClick={() => onUpdate(module.name)}><Edit className="w-4 h-4"/></Button>
                    <Button size="sm" variant="ghost" className="text-gray-500 hover:text-red-600" onClick={onDelete}><Trash2 className="w-4 h-4"/></Button>
                </div>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '12px' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="prose prose-sm dark:prose-invert max-w-none pl-8"
                    >
                        {module.pagecontent && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(module.pagecontent) }} />}
                        {module.renderedContent && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(module.renderedContent) }} />}
                        
                        {isImage && isLoadingImage && <div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /><span>Loading image...</span></div>}
                        {isImage && !isLoadingImage && imageUrl && <img src={imageUrl} alt={module.fileName} className="max-w-full h-auto rounded-md border" />}
                        {isImage && !isLoadingImage && !imageUrl && <div className="flex items-center gap-2 text-red-500"><ImageIcon className="w-4 h-4" /><span>Could not load image.</span></div>}

                        {module.modname === 'url' && module.mainUrl && <a href={module.mainUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open Link: {module.mainUrl}</a>}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ManageCourseContentPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentSection, setCurrentSection] = useState<number>(0);

  type ActivityType = 'resource' | 'page' | 'url' | 'folder' | 'scorm' | 'assignment' | 'quiz' | 'label' | 'zoom' | 'attendance';
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
  
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionSummary, setNewSectionSummary] = useState('');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchJson, setBatchJson] = useState('');
  const [batchError, setBatchError] = useState<string | null>(null);

  // --- NEW State for Edit/Delete ---
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState< {type: 'section' | 'activity', id: number} | null >(null);
  const [showEditSectionModal, setShowEditSectionModal] = useState<CourseSection | null>(null);
  const [showEditActivityModal, setShowEditActivityModal] = useState<ContentModule | null>(null);
  const [editName, setEditName] = useState('');
  const [editSummary, setEditSummary] = useState('');

  // --- NEW State for Assignment ---
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [assignmentCutoffDate, setAssignmentCutoffDate] = useState('');
  const [assignmentMaxGrade, setAssignmentMaxGrade] = useState(100);


  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line
  }, [courseId]);

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const sectionData = await getCourseContents(courseId!);
      setSections(sectionData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch course content');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (sectionNumber: number) => {
    setCurrentSection(sectionNumber);
    setShowAddModal(true);
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
        await contentBuilderService.addActivity(Number(courseId), currentSection, 'resource', fileTitle, [
          { name: 'description', value: fileDesc },
          { name: 'files', value: uploaded.itemid },
        ]);
      } else if (addType === 'page') {
        if (!pageTitle || !pageContent) throw new Error('Title and content are required');
        await contentBuilderService.addActivity(Number(courseId), currentSection, 'page', pageTitle, [
          { name: 'content', value: pageContent },
          { name: 'contentformat', value: 1 }
        ]);
      } else if (addType === 'url') {
        if (!urlTitle || !urlValue) throw new Error('Title and URL are required');
        await contentBuilderService.addActivity(Number(courseId), currentSection, 'url', urlTitle, [
          { name: 'description', value: urlDesc },
          { name: 'externalurl', value: urlValue },
        ]);
      } else if (addType === 'folder') {
        if (!folderFiles.length || !fileTitle) throw new Error('At least one file and a title are required');
        const uploaded = await schoolsService.uploadFile(folderFiles[0]); // Moodle needs a draft itemid
        await contentBuilderService.addActivity(Number(courseId), currentSection, 'folder', fileTitle, [
          { name: 'description', value: fileDesc },
          { name: 'files', value: uploaded.itemid },
        ]);
      } else if (addType === 'scorm') {
        if (!scormFile || !scormTitle) throw new Error('SCORM file and title are required');
        const uploaded = await schoolsService.uploadFile(scormFile);
        if (!uploaded || !uploaded.itemid) throw new Error('SCORM upload failed');
        await contentBuilderService.addActivity(Number(courseId), currentSection, 'scorm', scormTitle, [
          { name: 'description', value: scormDesc },
          { name: 'files', value: uploaded.itemid },
        ]);
      } else if (addType === 'assignment') {
        if (!assignmentTitle) throw new Error('Assignment title is required');
        // Convert datetime-local to Unix timestamp (seconds)
        const duedate = assignmentDueDate ? Math.floor(new Date(assignmentDueDate).getTime() / 1000) : 0;
        const cutoffdate = assignmentCutoffDate ? Math.floor(new Date(assignmentCutoffDate).getTime() / 1000) : 0;
        await contentBuilderService.addActivity(Number(courseId), currentSection, 'assign', assignmentTitle, [
          { name: 'description', value: assignmentDesc },
          { name: 'duedate', value: duedate },
          { name: 'cutoffdate', value: cutoffdate },
          { name: 'grade', value: assignmentMaxGrade },
        ]);
      } else if (addType === 'quiz') {
        if (!quizTitle) throw new Error('Quiz title is required');
        await contentBuilderService.addActivity(Number(courseId), currentSection, 'quiz', quizTitle, [
          { name: 'description', value: quizDesc },
        ]);
      } else if (addType === 'label') {
        if (!labelText) throw new Error('Label text is required');
        await contentBuilderService.addActivity(Number(courseId), currentSection, 'label', labelText, []);
      }
      
      setShowAddModal(false);
      // Reset all form states
      setFile(null); setFileTitle(''); setFileDesc('');
      setPageTitle(''); setPageContent('');
      setUrlTitle(''); setUrlValue(''); setUrlDesc('');
      setFolderFiles([]);
      setLabelText('');
      setAssignmentTitle(''); setAssignmentDesc('');
      setQuizTitle(''); setQuizDesc('');
      setScormFile(null); setScormTitle(''); setScormDesc('');
      setAssignmentDueDate(''); setAssignmentCutoffDate(''); setAssignmentMaxGrade(100);
      fetchContent();
    } catch (err: any) {
      setError(err.message || 'Failed to add content');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await contentBuilderService.createSection(Number(courseId), newSectionName, newSectionSummary);
      setShowSectionModal(false);
      setNewSectionName('');
      setNewSectionSummary('');
      fetchContent();
    } catch (err: any) {
      setError(err.message || 'Failed to create section');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBatchImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setBatchError(null);
    try {
      await contentBuilderService.batchImport(Number(courseId), JSON.parse(batchJson));
      setShowBatchModal(false);
      setBatchJson('');
      fetchContent();
    } catch (err: any) {
      setBatchError(err.message || 'Failed to batch import');
    } finally {
      setSubmitting(false);
    }
  };

  // --- NEW Edit/Delete Handlers ---
  const handleDelete = async () => {
      if (!showConfirmDeleteModal) return;

      setSubmitting(true);
      setError(null);
      try {
          if (showConfirmDeleteModal.type === 'section') {
              await contentBuilderService.deleteSection(showConfirmDeleteModal.id);
          } else {
              await contentBuilderService.deleteActivity(showConfirmDeleteModal.id);
          }
          setShowConfirmDeleteModal(null);
          fetchContent(); // Refresh the list
      } catch (err: any) {
          setError(err.message || `Failed to delete ${showConfirmDeleteModal.type}`);
      } finally {
          setSubmitting(false);
      }
  };

  const handleUpdateSection = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!showEditSectionModal) return;

      setSubmitting(true);
      setError(null);
      try {
          await contentBuilderService.updateSection(showEditSectionModal.id, editName, editSummary);
          setShowEditSectionModal(null);
          fetchContent();
      } catch (err: any) {
          setError(err.message || 'Failed to update section');
      } finally {
          setSubmitting(false);
      }
  };

  const handleUpdateActivity = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!showEditActivityModal) return;

      setSubmitting(true);
      setError(null);
      try {
          // --- DEBUG LOGGING ADDED ---
          console.log('Attempting to update activity. Cmid:', showEditActivityModal.id, 'New Name:', editName);
          // --- END DEBUG LOGGING ---
          
          await contentBuilderService.updateActivity(showEditActivityModal.id, editName);
          setShowEditActivityModal(null);
          fetchContent();
      } catch (err: any) {
          setError(err.message || 'Failed to update activity');
      } finally {
          setSubmitting(false);
      }
  };

  const openEditSectionModal = (section: CourseSection) => {
      setShowEditSectionModal(section);
      setEditName(section.name);
      setEditSummary(section.summary);
  };

  const openEditActivityModal = (module: ContentModule) => {
      setShowEditActivityModal(module);
      setEditName(module.name);
  };

  
  const activityTypes = [
    { value: 'resource', label: 'File' },
    { value: 'page', label: 'Page' },
    { value: 'url', label: 'URL' },
    { value: 'folder', label: 'Folder' },
    { value: 'scorm', label: 'SCORM Package' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'label', label: 'Text and Media Area' },
    { value: 'zoom', label: 'Zoom Meeting' },
    { value: 'attendance', label: 'Attendance' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Course Timeline</h1>
        <div className="flex items-center gap-2">
            <Button onClick={() => setShowSectionModal(true)} variant="outline">
                <PlusCircle className="w-4 h-4 mr-2" /> New Section
            </Button>
            <Button onClick={() => setShowBatchModal(true)} variant="outline">
                <Upload className="w-4 h-4 mr-2" /> Batch Import
            </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-4 text-gray-600 dark:text-gray-300">Loading timeline...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">{error}</div>
      ) : (
        <div className="space-y-8">
          {sections.map(section => (
            <motion.div 
              key={section.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
                  {section.name || `Section ${section.section}`}
                </h2>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-800" onClick={() => openEditSectionModal(section)}><Edit className="w-4 h-4"/></Button>
                    <Button size="sm" variant="ghost" className="text-gray-500 hover:text-red-600" onClick={() => setShowConfirmDeleteModal({type: 'section', id: section.id})}><Trash2 className="w-4 h-4"/></Button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {section.modules.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No activities in this section.</div>
                ) : (
                  section.modules.map(mod => 
                    <ModuleDisplay 
                        key={mod.id} 
                        module={mod} 
                        onDelete={() => setShowConfirmDeleteModal({type: 'activity', id: mod.id})}
                        onUpdate={() => openEditActivityModal(mod)}
                    />
                  )
                )}
              </div>
              <div className="p-4 border-t dark:border-gray-700">
                <Button onClick={() => handleOpenAddModal(section.section)} variant="secondary" className="w-full">
                    <Plus className="w-4 h-4 mr-2"/> Add activity to this section
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODALS: Add Content, Add Section, Batch Import */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowAddModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Add Activity</h2>
            <form onSubmit={handleAddContent} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Activity Type</label>
                <select value={addType} onChange={e => setAddType(e.target.value as ActivityType)} className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800">
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              {addType === 'resource' && (
                <>
                  <div><label className="block font-medium mb-1">File</label><input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full" /></div>
                  <div><label className="block font-medium mb-1">Title</label><input type="text" value={fileTitle} onChange={e => setFileTitle(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block font-medium mb-1">Description</label><textarea value={fileDesc} onChange={e => setFileDesc(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                </>
              )}
              {addType === 'page' && (
                <>
                  <div><label className="block font-medium mb-1">Title</label><input type="text" value={pageTitle} onChange={e => setPageTitle(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block font-medium mb-1">Content</label><textarea value={pageContent} onChange={e => setPageContent(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[100px]" /></div>
                </>
              )}
              {addType === 'url' && (
                <>
                  <div><label className="block font-medium mb-1">Title</label><input type="text" value={urlTitle} onChange={e => setUrlTitle(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block font-medium mb-1">URL</label><input type="url" value={urlValue} onChange={e => setUrlValue(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block font-medium mb-1">Description</label><textarea value={urlDesc} onChange={e => setUrlDesc(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                </>
              )}
               {addType === 'folder' && (
                <>
                  <div><label className="block font-medium mb-1">Title</label><input type="text" value={fileTitle} onChange={e => setFileTitle(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block font-medium mb-1">Files</label><input type="file" multiple onChange={e => setFolderFiles(Array.from(e.target.files || []))} className="w-full" /></div>
                  <div><label className="block font-medium mb-1">Description</label><textarea value={fileDesc} onChange={e => setFileDesc(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                </>
              )}
              {addType === 'scorm' && (
                <>
                  <div><label className="block font-medium mb-1">Title</label><input type="text" value={scormTitle} onChange={e => setScormTitle(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block font-medium mb-1">SCORM File (.zip)</label><input type="file" accept=".zip" onChange={e => setScormFile(e.target.files?.[0] || null)} className="w-full" /></div>
                  <div><label className="block font-medium mb-1">Description</label><textarea value={scormDesc} onChange={e => setScormDesc(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                </>
              )}
              {addType === 'assignment' && (
                <>
                  <div><label className="block font-medium mb-1">Title</label><input type="text" value={assignmentTitle} onChange={e => setAssignmentTitle(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block font-medium mb-1">Description</label><textarea value={assignmentDesc} onChange={e => setAssignmentDesc(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block font-medium mb-1">Due Date</label><input type="datetime-local" value={assignmentDueDate} onChange={e => setAssignmentDueDate(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block font-medium mb-1">Cutoff Date</label><input type="datetime-local" value={assignmentCutoffDate} onChange={e => setAssignmentCutoffDate(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block font-medium mb-1">Max Grade</label><input type="number" value={assignmentMaxGrade} onChange={e => setAssignmentMaxGrade(Number(e.target.value))} className="w-full border rounded px-3 py-2" min={0} max={100} /></div>
                </>
              )}
              {addType === 'quiz' && (
                <>
                  <div><label className="block font-medium mb-1">Title</label><input type="text" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block font-medium mb-1">Description</label><textarea value={quizDesc} onChange={e => setQuizDesc(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                </>
              )}
              {addType === 'label' && (
                <>
                  <div><label className="block font-medium mb-1">Text / Media</label><textarea value={labelText} onChange={e => setLabelText(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                </>
              )}
              {error && <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded-md">{error}</div>}
              <Button type="submit" disabled={submitting} className="w-full mt-4">
                {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2 inline" /> : <PlusCircle className="w-4 h-4 mr-2 inline" />} Add Activity
              </Button>
            </form>
          </div>
        </div>
      )}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowSectionModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Create New Section</h2>
            <form onSubmit={handleCreateSection} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Section Name (e.g., "Day 1 - July 25th")</label>
                <input type="text" value={newSectionName} onChange={e => setNewSectionName(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Summary</label>
                <textarea value={newSectionSummary} onChange={e => setNewSectionSummary(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full mt-4">Create Section</Button>
            </form>
          </div>
        </div>
      )}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowBatchModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Batch Import Content</h2>
            <form onSubmit={handleBatchImport} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">JSON Structure</label>
                <textarea value={batchJson} onChange={e => setBatchJson(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[200px] font-mono text-sm" placeholder='[{"section": {"name": "Day 1"}, "activities": [{"modname": "label", "name": "10:00 - Intro"}, {"modname": "page", "name": "..."}]}]'></textarea>
              </div>
              {batchError && <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md">{batchError}</div>}
              <Button type="submit" disabled={submitting} className="w-full mt-4">Import Content</Button>
            </form>
          </div>
        </div>
      )}

      {/* --- NEW MODALS for Edit/Delete --- */}
      {showEditSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowEditSectionModal(null)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Section</h2>
            <form onSubmit={handleUpdateSection} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Section Name</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Summary</label>
                <textarea value={editSummary} onChange={e => setEditSummary(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full mt-4">
                {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2 inline"/> : null} Save Changes
              </Button>
            </form>
          </div>
        </div>
      )}

      {showEditActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowEditActivityModal(null)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Activity</h2>
            <form onSubmit={handleUpdateActivity} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Activity Name</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              {/* Note: More complex editing would require fetching all module settings */}
              <Button type="submit" disabled={submitting} className="w-full mt-4">
                {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2 inline"/> : null} Save Changes
              </Button>
            </form>
          </div>
        </div>
      )}

      {showConfirmDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this {showConfirmDeleteModal.type}? This action cannot be undone.</p>
            {error && <div className="text-red-600 text-sm mb-4 p-2 bg-red-50 rounded-md">{error}</div>}
            <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(null)} disabled={submitting}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete} disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2 inline"/> : null} Delete
                </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourseContentPage; 