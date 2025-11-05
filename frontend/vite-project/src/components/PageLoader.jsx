import React from 'react';

const PageLoader = () => {
  return (
    // Optional: Add a dark overlay to make the loader pop
    <div className="fixed inset-0 bg-base-300/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="flex space-x-8">
        
        {/* Loader 1: Circle */}
        <div className="loader w-11 h-11 relative inline-block mx-4">
          <svg viewBox="0 0 80 80">
            <circle r="32" cy="40" cx="40" id="test"></circle>
          </svg>
        </div>

        {/* Loader 2: Triangle */}
        <div className="loader triangle w-12 h-11 relative inline-block mx-4">
          <svg viewBox="0 0 86 80">
            <polygon points="43 8 79 72 7 72"></polygon>
          </svg>
        </div>

        {/* Loader 3: Rectangle */}
        <div className="loader w-11 h-11 relative inline-block mx-4">
          <svg viewBox="0 0 80 80">
            <rect height="64" width="64" y="8" x="8"></rect>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;