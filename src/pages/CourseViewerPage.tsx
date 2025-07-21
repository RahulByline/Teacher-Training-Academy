import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseContents } from '../services/apiService';
import DOMPurify from 'dompurify';
import axios from 'axios';
import { Loader2, BookOpen, Tag, FileText, Link as LinkIcon, ChevronLeft, Image as ImageIcon } from 'lucide-react';

// Define types locally for clarity
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
    name:string;
    section: number;
    summary: string;
    modules: ContentModule[];
}

// Sub-component to render each module's content
const ModuleViewer: React.FC<{ module: ContentModule }> = ({ module }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false);

    const getModuleIcon = (modname: string) => {
        switch(modname) {
          case 'resource': return <FileText className="w-6 h-6 text-blue-500 flex-shrink-0" />;
          case 'page': return <BookOpen className="w-6 h-6 text-green-500 flex-shrink-0" />;
          case 'url': return <LinkIcon className="w-6 h-6 text-purple-500 flex-shrink-0" />;
          case 'label': return <Tag className="w-6 h-6 text-gray-500 flex-shrink-0" />;
          case 'assign': return <FileText className="w-6 h-6 text-pink-500 flex-shrink-0" />;
          default: return <FileText className="w-6 h-6 text-gray-400 flex-shrink-0" />;
        }
    };

    const isImage = module.fileName && /\.(jpg|jpeg|png|gif)$/i.test(module.fileName);

    useEffect(() => {
        let objectUrl: string | null = null;
        const fetchImage = async () => {
            if (isImage && module.mainUrl) {
                setIsLoadingImage(true);
                try {
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
        return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
    }, [isImage, module.mainUrl]);

    // Render logic
    const contentHtml = module.pagecontent || module.renderedContent;
    const sanitizedHtml = contentHtml ? DOMPurify.sanitize(contentHtml) : '';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start gap-4">
                <div className="mt-1">{getModuleIcon(module.modname)}</div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{module.name}</h3>
                    {sanitizedHtml && <div className="prose prose-sm dark:prose-invert max-w-none mt-2" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />}
                    {isImage && (
                        <div className="mt-2">
                            {isLoadingImage && <div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /><span>Loading image...</span></div>}
                            {!isLoadingImage && imageUrl && <img src={imageUrl} alt={module.fileName} className="max-w-xs h-auto rounded-md border" />}
                            {!isLoadingImage && !imageUrl && <div className="flex items-center gap-2 text-red-500"><ImageIcon className="w-4 h-4" /><span>Could not load image.</span></div>}
                        </div>
                    )}
                    {module.modname === 'url' && module.mainUrl && <a href={module.mainUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">Open Link &rarr;</a>}
                </div>
            </div>
        </div>
    );
};


// Main page component
const CourseViewerPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [sections, setSections] = useState<CourseSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!courseId) return;
        const fetchCourseData = async () => {
            setLoading(true);
            setError(null);
            try {
                const content = await getCourseContents(courseId);
                setSections(content);
            } catch (err: any) {
                setError(err.message || "Failed to load course content.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-red-50 text-red-700">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="mb-6">
                    <Link to="/dashboard" className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Dashboard
                    </Link>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Course Content</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Follow the timeline to complete your training modules.</p>

                <div className="space-y-10">
                    {sections.map(section => (
                        <div key={section.id}>
                            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4 pb-2 border-b-2 border-blue-200 dark:border-gray-700">{section.name || `Section ${section.section}`}</h2>
                            <div className="space-y-4">
                                {section.modules.map(module => <ModuleViewer key={module.id} module={module} />)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseViewerPage; 