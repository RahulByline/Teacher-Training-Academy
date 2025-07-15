import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, change }) => (
  <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-gray-100">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
    <div className="text-sm text-gray-500">{label}</div>
    {change && <div className="text-xs text-green-600">{change}</div>}
  </div>
); 