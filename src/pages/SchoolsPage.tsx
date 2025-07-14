import React, { useEffect, useState } from 'react';
import { getAllCompanies } from '../services/apiService';

interface School {
  id: number;
  name: string;
  shortname: string;
  description: string;
  city?: string;
  country?: string;
  category?: string;
  contact?: any;
  logo?: string;
  status?: string;
}

const SchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllCompanies()
      .then((data) => {
        setSchools(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load schools');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading schools...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Schools</h1>
        <p className="text-gray-600 text-lg">
          Excellence in education across the region - {schools.length} partnered institutions
        </p>
      </header>
      {schools.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-lg">No schools found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div key={school.id} className="border rounded-lg p-6 shadow bg-white">
              <div className="font-semibold text-lg mb-2">{school.name || 'Unnamed School'}</div>
              <div className="text-gray-600 mb-1">Short Name: {school.shortname || 'N/A'}</div>
              <div className="text-gray-600 mb-1">Description: {school.description || 'N/A'}</div>
              <div className="text-gray-600 mb-1">
                Location: {school.city || 'N/A'}, {school.country || 'N/A'}
              </div>
              <div className="text-gray-600 mb-1">Category: {school.category || 'N/A'}</div>
              {school.contact && (
                <div className="text-gray-600 mb-1">
                  Contact: {school.contact}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolsPage;