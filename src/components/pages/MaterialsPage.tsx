import React from 'react';
import { Folder } from 'lucide-react';

const mockMaterials = [
  { title: 'Digital Learning Slides', type: 'PDF', size: '2.1MB' },
  { title: 'Assessment Templates', type: 'DOCX', size: '1.3MB' },
  { title: 'Mentoring Guide', type: 'PDF', size: '900KB' },
  { title: 'Classroom Management Video', type: 'MP4', size: '120MB' },
];

const MaterialsPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-[#f9fafb] p-8">
    <div className="flex items-center gap-3 mb-6">
      <Folder className="w-8 h-8 text-indigo-500" />
      <h1 className="text-2xl font-bold text-gray-900">Teaching Materials</h1>
    </div>
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Resources</h2>
      <ul className="divide-y divide-gray-100">
        {mockMaterials.map((item) => (
          <li key={item.title} className="py-3 flex flex-col md:flex-row md:items-center md:gap-4">
            <span className="font-medium text-gray-800">{item.title}</span>
            <span className="text-xs text-gray-500 ml-2">{item.type}</span>
            <span className="text-xs text-gray-400 ml-2">{item.size}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default MaterialsPage; 