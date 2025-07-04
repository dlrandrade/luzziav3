import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-[3px]',
    lg: 'w-8 h-8 border-4',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-slate-300 border-t-slate-800 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    ></div>
  );
};

export default Spinner;