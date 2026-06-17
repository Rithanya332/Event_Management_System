import React from 'react';
const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${color || 'text-gray-800'}`}>{value}</p>
        {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color ? color.replace('text-', 'bg-').replace('-800','').replace('-700','').replace('-600','') + '-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
    </div>
  </div>
);
export default StatCard;
