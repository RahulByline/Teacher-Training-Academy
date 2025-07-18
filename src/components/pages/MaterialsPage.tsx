import React, { useEffect, useState } from 'react';
import { Folder, FileText, FileAudio, FileVideo, FileImage, FileArchive, File } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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

const MaterialsPage: React.FC = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(materials.length / itemsPerPage);
  const pagedMaterials = materials.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Get unique course names and file types for filters
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

  // Filtered materials
  const filteredMaterials = materials.filter((item: any) => {
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
          // contents: array of sections, each with modules
          contents.forEach((section: any) => {
            (section.modules || []).forEach((mod: any) => {
              // Only look for resources with contents (files)
              if (mod.modname === 'resource' && Array.isArray(mod.contents)) {
                mod.contents.forEach((file: any) => {
                  // Filter for common teaching material types
                  if (file.mimetype && (
                    file.mimetype.startsWith('application/pdf') ||
                    file.mimetype.startsWith('application/msword') ||
                    file.mimetype.includes('wordprocessingml') ||
                    file.mimetype.includes('presentation') ||
                    file.mimetype.includes('powerpoint') ||
                    file.mimetype.startsWith('audio/') ||
                    file.mimetype.startsWith('video/') ||
                    file.mimetype.startsWith('image/') ||
                    file.mimetype.includes('zip') ||
                    file.mimetype.includes('rar')
                  )) {
                    allFiles.push({
                      ...file,
                      courseName: course.fullname,
                    });
                  }
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

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col items-center justify-start py-12 px-2 md:px-8">
      <div className="w-full px-4">
        <div className="flex items-center gap-3 mb-8">
          <Folder className="w-10 h-10 text-indigo-500" />
          <h1 className="text-3xl font-bold text-gray-900">Teaching Materials</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Resources</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-16 text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-16 text-lg">{error}</div>
          ) : materials.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-lg">No teaching materials found.</div>
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
                  <div key={item.fileurl + idx} className={`${getCardBg(item.mimetype)} rounded-2xl shadow hover:shadow-xl transition-all duration-200 p-6 flex flex-col h-full group min-w-0`}>
                    <div className="flex items-center gap-3 mb-4 w-full min-w-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 transition-all">
                        {getFileIcon(item.mimetype)}
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <div className="font-semibold text-gray-900 text-base line-clamp-2 break-all min-w-0 w-full" title={item.filename}>{item.filename}</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">{item.mimetype.split('/').pop()?.toUpperCase() || 'FILE'}</span>
                          {item.courseName && (
                            <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">{item.courseName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">{item.filesize ? (item.filesize / 1024).toFixed(1) + ' KB' : '-'}</span>
                      <a
                        href={item.fileurl}
                        target="_blank"
                        rel="noopener noreferrer"
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
}

export default MaterialsPage; 