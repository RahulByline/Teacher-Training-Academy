import React, { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';
import { User as UserIcon, Users, Mail, Circle, Grid, List, X } from 'lucide-react';

const roleColors: Record<string, string> = {
  teacher: 'border-blue-400 bg-blue-50',
  trainer: 'border-green-400 bg-green-50',
  trainee: 'border-purple-400 bg-purple-50',
  default: 'border-gray-300 bg-gray-50',
};

const statusColors: Record<string, string> = {
  Online: 'text-green-500',
  Offline: 'text-gray-400',
  'In 1h': 'text-yellow-500',
  Yesterday: 'text-orange-400',
  Tomorrow: 'text-blue-400',
};

const getStatus = (lastaccess?: number) => {
  if (!lastaccess) return 'Offline';
  const last = new Date(lastaccess * 1000);
  const now = new Date();
  const diff = (now.getTime() - last.getTime()) / (1000 * 60 * 60); // hours
  if (diff < 1) return 'Online';
  if (diff < 24) return `In 1h`;
  if (diff < 48) return 'Yesterday';
  if (diff < 72) return 'Tomorrow';
  return 'Offline';
};

const PeerProfileModal = ({ peer, onClose }: { peer: any, onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
      <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100" onClick={onClose}><X className="w-5 h-5" /></button>
      <div className="flex flex-col items-center gap-3">
        <img
          src={peer.profileimageurl || '/logo/Riyada.png'}
          alt={peer.fullname}
          className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200 mb-2 bg-white"
        />
        <div className="font-bold text-xl text-gray-900 mb-1">{peer.fullname}</div>
        <div className="text-xs text-indigo-700 font-medium mb-1">{peer.role}</div>
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Mail className="w-4 h-4" />{peer.email}</div>
        <div className="flex items-center gap-2 mt-2">
          <Circle className={`w-3 h-3 ${statusColors[getStatus(peer.lastaccess)] || 'text-gray-400'}`} />
          <span className="text-xs text-gray-500">{getStatus(peer.lastaccess)}</span>
        </div>
      </div>
    </div>
  </div>
);

const TeacherPeerNetworkPage: React.FC = () => {
  const [peers, setPeers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedPeer, setSelectedPeer] = useState<any | null>(null);

  useEffect(() => {
    async function fetchPeers() {
      setLoading(true);
      setError(null);
      try {
        const users = await apiService.getAllUsers();
        const filtered = users.filter((u: any) => ['teacher', 'trainer', 'trainee'].includes(u.role));
        setPeers(filtered);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch peers');
      } finally {
        setLoading(false);
      }
    }
    fetchPeers();
  }, []);

  const filteredPeers = peers.filter((peer: any) => {
    const matchesSearch = !search || peer.fullname.toLowerCase().includes(search.toLowerCase()) || (peer.email && peer.email.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'all' || peer.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col items-center justify-start py-12 px-2 md:px-8">
      <div className="w-full px-4">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-10 h-10 text-indigo-500" />
          <h1 className="text-3xl font-bold text-gray-900">Peer Network</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6 w-full">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
            />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Roles</option>
              <option value="teacher">Teacher</option>
              <option value="trainer">Trainer</option>
              <option value="trainee">Trainee</option>
            </select>
            <div className="flex gap-2 ml-auto">
              <button
                className={`p-2 rounded-lg border ${view === 'grid' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-indigo-50'}`}
                onClick={() => setView('grid')}
                title="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-lg border ${view === 'list' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-indigo-50'}`}
                onClick={() => setView('list')}
                title="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          {loading ? (
            <div className="text-center text-gray-500 py-16 text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-16 text-lg">{error}</div>
          ) : filteredPeers.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-lg">No peers found.</div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {filteredPeers.map((peer: any) => (
                <div
                  key={peer.id}
                  className={`rounded-2xl shadow hover:shadow-xl transition-all duration-200 p-5 flex flex-col items-center border-2 cursor-pointer ${roleColors[peer.role] || roleColors.default}`}
                  onClick={() => setSelectedPeer(peer)}
                  tabIndex={0}
                >
                  <img
                    src={peer.profileimageurl || '/logo/Riyada.png'}
                    alt={peer.fullname}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 mb-3 bg-white"
                  />
                  <div className="font-semibold text-gray-900 text-lg text-center mb-1 truncate w-full" title={peer.fullname}>{peer.fullname}</div>
                  <div className="text-xs text-indigo-700 font-medium mb-1">{peer.role}</div>
                  <div className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Mail className="w-4 h-4" />{peer.email}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Circle className={`w-3 h-3 ${statusColors[getStatus(peer.lastaccess)] || 'text-gray-400'}`} />
                    <span className="text-xs text-gray-500">{getStatus(peer.lastaccess)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full divide-y divide-gray-200">
              {filteredPeers.map((peer: any) => (
                <div
                  key={peer.id}
                  className={`flex items-center gap-4 py-4 px-2 border-l-4 cursor-pointer ${roleColors[peer.role] || roleColors.default}`}
                  onClick={() => setSelectedPeer(peer)}
                  tabIndex={0}
                >
                  <img
                    src={peer.profileimageurl || '/logo/Riyada.png'}
                    alt={peer.fullname}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-base truncate" title={peer.fullname}>{peer.fullname}</div>
                    <div className="text-xs text-indigo-700 font-medium mb-1">{peer.role}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-4 h-4" />{peer.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className={`w-3 h-3 ${statusColors[getStatus(peer.lastaccess)] || 'text-gray-400'}`} />
                    <span className="text-xs text-gray-500">{getStatus(peer.lastaccess)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedPeer && <PeerProfileModal peer={selectedPeer} onClose={() => setSelectedPeer(null)} />}
    </div>
  );
};

export default TeacherPeerNetworkPage; 