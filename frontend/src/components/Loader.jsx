import React from 'react';
const Loader = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`}></div>
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
};
export default Loader;
