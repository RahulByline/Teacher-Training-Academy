import React, { useEffect, useState } from 'react';
import { Folder, FileText, FileAudio, FileVideo, FileImage, FileArchive, File } from 'lucide-react';
import { apiService } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const getFileIcon = (mimetype: string) => {
  if (mimetype.startsWith('image/')) return <FileImage className="w-5 h-5 text-blue-400" />;
  if (mimetype.startsWith('audio/')) return <FileAudio className="w-5 h-5 text-green-500" />;
  if (mimetype.startsWith('video/')) return <FileVideo className="w-5 h-5 text-purple-500" />;
  if (mimetype === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
  if (mimetype.includes('presentation') || mimetype.includes('powerpoint')) return <FileText className="w-5 h-5 text-orange-500" />;
  if (mimetype.includes('msword') || mimetype.includes('wordprocessingml')) return <FileText className="w-5 h-5 text-blue-700" />;
  if (mimetype.includes('spreadsheet') || mimetype.includes('excel')) return <FileText className="w-5 h-5 text-green-700" />;
  if (mimetype.includes('zip') || mimetype.includes('rar')) return <FileArchive className="w-5 h-5 text-yellow-600" />;
  return <File className="w-5 h-5 text-gray-400" />;
};

const getCardBg = (mimetype: string) => {
  if (mimetype === 'application/pdf') return 'bg-red-50';
  if (mimetype.includes('msword') || mimetype.includes('wordprocessingml')) return 'bg-blue-50';
  if (mimetype.includes('presentation') || mimetype.includes('powerpoint')) return 'bg-orange-50';
  if (mimetype.startsWith('audio/')) return 'bg-green-50';
  if (mimetype.startsWith('video/')) return 'bg-purple-50';
  return 'bg-gray-50';
};

// Helper to get a download URL with token
const getDownloadUrl = (fileurl: string) => {
  if (!fileurl) return '';
  if (fileurl.includes('token=')) return fileurl;
  const token = '4a2ba2d6742afc7d13ce4cf486ba7633'; // Use the same token as apiService
  return fileurl.includes('?') ? `${fileurl}&token=${token}` : `${fileurl}?token=${token}`;
};

const TeacherResourceLibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    async function fetchMaterials() {
      setLoading(true);
      setError(null);
      try {
        if (!user || !user.id) throw new Error('User not found');
        const courses = await apiService.getUserCourses(user.id);
        let allFiles: any[] = [];
        for (const course of courses) {
          const contents = await apiService.getCourseContents(String(course.id));
          contents.forEach((section: any) => {
            (section.modules || []).forEach((mod: any) => {
              if (mod.modname === 'resource' && Array.isArray(mod.contents)) {
                mod.contents.forEach((file: any) => {
                  allFiles.push({
                    ...file,
                    courseName: course.fullname,
                  });
                });
              }
            });
          });
        }
        setMaterials(allFiles);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch materials');
      } finally {
        setLoading(false);
      }
    }
    fetchMaterials();
  }, [user]);

  // Resource type tabs with color
  const typeTabs = [
    { label: 'All', value: 'all', color: 'bg-gray-200 text-gray-800 border-gray-300' },
    { label: 'Documents', value: 'documents', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { label: 'Videos', value: 'video', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { label: 'Audio', value: 'audio', color: 'bg-green-100 text-green-800 border-green-300' },
    { label: 'Images', value: 'image', color: 'bg-pink-100 text-pink-800 border-pink-300' },
    { label: 'Archives', value: 'archive', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  ];

  // Helper to determine tab type
  const getTabType = (mimetype: string) => {
    if (!mimetype) return 'other';
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('audio/')) return 'audio';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.includes('zip') || mimetype.includes('rar')) return 'archive';
    if (
      mimetype === 'application/pdf' ||
      mimetype.includes('msword') ||
      mimetype.includes('wordprocessingml') ||
      mimetype.includes('presentation') ||
      mimetype.includes('powerpoint') ||
      mimetype.includes('spreadsheet') ||
      mimetype.includes('excel')
    ) return 'documents';
    return 'other';
  };

  // Add state for active tab
  const [activeTab, setActiveTab] = useState('all');

  // Filter by tab
  const tabFilteredMaterials = activeTab === 'all'
    ? materials
    : materials.filter((item: any) => getTabType(item.mimetype) === activeTab);

  // Filters and pagination
  const courseOptions = Array.from(new Set(materials.map(m => m.courseName).filter(Boolean)));
  const typeOptions = Array.from(new Set(materials.map(m => {
    if (!m.mimetype) return 'Other';
    if (m.mimetype === 'application/pdf') return 'PDF';
    if (m.mimetype.includes('msword') || m.mimetype.includes('wordprocessingml')) return 'DOCX';
    if (m.mimetype.includes('presentation') || m.mimetype.includes('powerpoint')) return 'PPT';
    if (m.mimetype.startsWith('audio/')) return 'Audio';
    if (m.mimetype.startsWith('video/')) return 'Video';
    return m.mimetype.split('/').pop()?.toUpperCase() || 'Other';
  })));

  const filteredMaterials = tabFilteredMaterials.filter((item: any) => {
    const matchesSearch = !search || item.filename.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === 'all' || item.courseName === courseFilter;
    let typeLabel = 'Other';
    if (item.mimetype === 'application/pdf') typeLabel = 'PDF';
    else if (item.mimetype.includes('msword') || item.mimetype.includes('wordprocessingml')) typeLabel = 'DOCX';
    else if (item.mimetype.includes('presentation') || item.mimetype.includes('powerpoint')) typeLabel = 'PPT';
    else if (item.mimetype.startsWith('audio/')) typeLabel = 'Audio';
    else if (item.mimetype.startsWith('video/')) typeLabel = 'Video';
    else typeLabel = item.mimetype.split('/').pop()?.toUpperCase() || 'Other';
    const matchesType = typeFilter === 'all' || typeLabel === typeFilter;
    return matchesSearch && matchesCourse && matchesType;
  });
  const filteredTotalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const pagedFilteredMaterials = filteredMaterials.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Helper to get a friendly file type label
  const getTypeLabel = (mimetype: string) => {
    if (!mimetype) return 'Other';
    if (mimetype === 'application/pdf') return 'PDF';
    if (mimetype.includes('msword') || mimetype.includes('wordprocessingml')) return 'DOCX';
    if (mimetype.includes('presentation') || mimetype.includes('powerpoint')) return 'PPT';
    if (mimetype.startsWith('audio/')) return 'Audio';
    if (mimetype.startsWith('video/')) return 'Video';
    return mimetype.split('/').pop()?.toUpperCase() || 'Other';
  };

  // Helper to get card color by type
  const getCardColor = (mimetype: string) => {
    const type = getTabType(mimetype);
    if (type === 'documents') return 'bg-blue-50 border-blue-200';
    if (type === 'video') return 'bg-purple-50 border-purple-200';
    if (type === 'audio') return 'bg-green-50 border-green-200';
    if (type === 'image') return 'bg-pink-50 border-pink-200';
    if (type === 'archive') return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col items-center justify-start py-12 px-2 md:px-8">
      <div className="w-full px-4">
        <div className="flex items-center gap-3 mb-8">
          <Folder className="w-10 h-10 text-indigo-500" />
          <h1 className="text-3xl font-bold text-gray-900">Resource Library</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
          {/* Resource Type Tabs */}
          <div className="flex gap-2 mb-6">
            {typeTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => { setActiveTab(tab.value); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-150
                  ${activeTab === tab.value
                    ? `${tab.color} border-2 shadow`
                    : `${tab.color.replace('bg-', 'bg-opacity-50 bg-')} border ${tab.color.replace('text-', 'text-opacity-70 text-')} hover:bg-opacity-80`}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Resources</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-16 text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-16 text-lg">{error}</div>
          ) : materials.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-lg">No resources found.</div>
          ) : (
            <>
              {/* Filters/Search */}
              <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6 w-full">
                <div className="flex-1">
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by file name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600">Course</label>
                  <select
                    value={courseFilter}
                    onChange={e => { setCourseFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Courses</option>
                    {courseOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-600">File Type</label>
                  <select
                    value={typeFilter}
                    onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Types</option>
                    {typeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {pagedFilteredMaterials.map((item: any, idx: number) => (
                  <div key={item.fileurl + idx} className={`rounded-2xl shadow hover:shadow-xl transition-all duration-200 p-4 flex flex-col h-40 min-h-[8rem] max-h-40 group min-w-0 border ${getCardColor(item.mimetype)} justify-between`}>
                    <div className="flex items-center gap-3 mb-4 w-full min-w-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 transition-all">
                        {getFileIcon(item.mimetype)}
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="font-semibold text-gray-900 text-base line-clamp-1 break-all min-w-0 w-full" title={item.filename}>{item.filename}</div>
                        <div className="flex flex-nowrap gap-2 mt-1 w-full overflow-hidden">
                          <span
                            className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium max-w-[70px] truncate"
                            title={getTypeLabel(item.mimetype)}
                          >
                            {getTypeLabel(item.mimetype)}
                          </span>
                          {item.courseName && (
                            <span
                              className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium max-w-[100px] truncate"
                              title={item.courseName}
                            >
                              {item.courseName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">{item.filesize ? (item.filesize / 1024).toFixed(1) + ' KB' : '-'}</span>
                      <a
                        href={getDownloadUrl(item.fileurl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow hover:bg-indigo-700 transition-colors"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              {filteredTotalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  {Array.from({ length: filteredTotalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors duration-150 ${page === i + 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
  </div>
);
};

export default TeacherResourceLibraryPage; 