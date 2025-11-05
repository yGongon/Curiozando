import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
    </div>
  );
};

export default LoadingSpinner;