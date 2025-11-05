import React from 'react';
import Sidebar from './Sidebar'
import Navbar from './Navbar';

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar (conditionally rendered) */}
      {showSidebar && <Sidebar />}

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showSidebar ? 'ml-64' : ''
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
