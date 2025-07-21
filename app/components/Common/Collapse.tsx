import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface CollapseProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Collapse: React.FC<CollapseProps> = ({ 
  title, 
  icon,
  children, 
  defaultOpen = true 

}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <button
        type="button"
        className={`
          w-full px-4 py-3 
          flex items-center justify-between
          text-left text-sm font-medium
          bg-gradient-to-r from-gray-50 to-white
          border border-gray-200 rounded-md
          transition-all duration-300 ease-in-out
          hover:shadow-md hover:border-blue-200
          hover:from-blue-50/30 hover:to-white
          ${isOpen ? 'rounded-b-none border-b-0' : ''}
          group
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700 group-hover:text-gray-900 flex gap-2">
          {icon}
          {title}
        </span>
        <div className={`
          transform transition-transform duration-300 ease-in-out
          text-gray-400 group-hover:text-blue-500
          group-hover:scale-110
          ${isOpen ? 'rotate-180' : ''}
        `}>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </button>
      {isOpen && (
        <div className={`
          overflow-hidden
          bg-white/60 backdrop-blur-sm
          border-x border-b border-gray-200 rounded-b-md
          shadow-inner
        `}>
          <div className="p-4 space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collapse; 