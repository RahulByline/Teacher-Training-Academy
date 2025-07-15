import React, { useState, useRef, useEffect } from 'react';
import { Bell, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface DashboardHeaderProps {
  user?: any;
  onProfile: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onProfile, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="flex items-center justify-between bg-white px-8 py-6 shadow border-b border-gray-200">
      <div className="font-bold text-xl flex items-center gap-3">
        <span className="inline-block bg-blue-100 p-2 rounded-full"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg></span>
        Riyada Trainings
      </div>
      <div className="flex items-center gap-4">
        <input className="border rounded px-3 py-2 w-72" placeholder="Search courses, teachers, or resources" />
        <button className="relative bg-white p-2 rounded-full hover:bg-blue-50">
          <Bell className="w-6 h-6 text-blue-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
        </button>
        <Button className="flex items-center gap-2" variant="primary">
          <Plus className="w-4 h-4" /> New Report
        </Button>
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <img
              src={user?.profileimageurl || '/default-avatar.png'}
              alt="Admin Avatar"
              className="w-9 h-9 rounded-full object-cover border"
            />
            <span className="font-medium text-gray-700">{user?.fullname || 'Admin User'}</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                onClick={onProfile}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}; 