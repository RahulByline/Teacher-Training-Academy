import React, { useEffect, useState } from 'react';
import { Users, User as UserIcon, Mail } from 'lucide-react';
import { apiService } from '../../services/api';

const CommunityPage: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchCommunity() {
      setLoading(true);
      setError(null);
      try {
        const users = await apiService.getAllUsers();
        const trainers = users.filter((u: any) => u.role === 'trainer');
        setMembers(trainers);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch community members');
      } finally {
        setLoading(false);
      }
    }
    fetchCommunity();
  }, []);

  const filteredMembers = members.filter((m) =>
    m.fullname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col items-center justify-start py-12 px-2 md:px-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-10 h-10 text-indigo-500" />
          <h1 className="text-3xl font-bold text-gray-900">Trainer Community</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6 w-full">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
            />
          </div>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Community Members</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-16 text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-16 text-lg">{error}</div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-lg">No trainers found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-gray-50 rounded-2xl shadow hover:shadow-xl transition-all duration-200 p-6 flex flex-col items-center group">
                  <img
                    src={member.profileimageurl || '/logo-BYbhmxQK-removebg-preview.png'}
                    alt={member.fullname}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 mb-3 bg-white"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = '/logo-BYbhmxQK-removebg-preview.png'; }}
                  />
                  <div className="font-semibold text-gray-900 text-lg text-center mb-1 truncate w-full" title={member.fullname}>{member.fullname}</div>
                  <div className="text-xs text-indigo-700 font-medium mb-1 flex items-center gap-1"><UserIcon className="w-4 h-4" />{member.role}</div>
                  <div className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Mail className="w-4 h-4" />{member.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage; 