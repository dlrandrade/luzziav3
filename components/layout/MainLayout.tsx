import React from 'react';

interface MainLayoutProps {
  leftSidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ leftSidebar, mainContent, rightSidebar }) => {
  return (
    <div className="flex h-screen bg-[#f8f8f6]">
      <aside className="w-72 bg-white flex-shrink-0 p-4 flex flex-col border-r border-slate-200">
        {leftSidebar}
      </aside>
      <main className="flex-1 flex flex-col bg-transparent overflow-y-auto p-4 md:p-6">
        {mainContent}
      </main>
      {rightSidebar && (
        <aside className="w-80 bg-white flex-shrink-0 p-4 border-l border-slate-200 flex flex-col">
          {rightSidebar}
        </aside>
      )}
    </div>
  );
};

export default MainLayout;