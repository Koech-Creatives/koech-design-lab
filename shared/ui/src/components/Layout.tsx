import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

export function Layout({ children, className = '', sidebar, header }: LayoutProps) {
  if (sidebar) {
    return (
      <div className={`flex h-screen bg-gray-50 ${className}`}>
        <div className="flex-shrink-0 w-64 bg-white border-r border-gray-200">
          {sidebar}
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {header && (
            <div className="flex-shrink-0 bg-white border-b border-gray-200">
              {header}
            </div>
          )}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {header && (
        <div className="bg-white border-b border-gray-200">
          {header}
        </div>
      )}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
} 