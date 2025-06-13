import React from 'react';

interface PanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function Panel({ 
  title, 
  children, 
  className = '', 
  headerClassName = '',
  contentClassName = ''
}: PanelProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {title && (
        <div className={`px-4 py-3 border-b border-gray-200 ${headerClassName}`}>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className={`p-4 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
} 