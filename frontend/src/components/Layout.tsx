import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-text-main p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary tracking-tight">FileShare</h1>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
