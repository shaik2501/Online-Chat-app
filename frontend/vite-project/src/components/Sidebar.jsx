import React, { useState } from 'react';
import { useAuthUser } from '../hooks/useAuthUser';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Bell, LogOut, MessageCircle, Settings, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// Navigation items definition
const navItems = [
  { name: 'Home', path: '/', Icon: Home },

  { name: 'Notifications', path: '/notifications', Icon: Bell },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const handleNavigation = (path) => navigate(path);
  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#000000]/80 backdrop-blur-xl border-r border-[#14213d] transition-all duration-300 ease-in-out z-50 
      ${isCollapsed ? 'w-20' : 'w-64'} shadow-2xl shadow-[#000000]/50`}
    >
      {/* Header */}
      <header className="p-6 border-b border-[#14213d] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#fca311]/20 rounded-xl blur-lg"></div>
              <div className="relative bg-[#14213d] p-2 rounded-xl border border-[#14213d]">
                <Sparkles className="w-5 h-5 text-[#fca311]" />
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#fca311] via-[#e5e5e5] to-[#ffffff] tracking-tight">
              ChatGuy
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 bg-[#14213d] text-[#e5e5e5] rounded-xl border border-[#14213d] hover:border-[#fca311]/50 hover:text-[#fca311] transition-all duration-200 group"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </header>

      {/* User Profile Section */}
      {!isCollapsed && authUser && (
        <div className="p-4 border-b border-[#14213d]">
          <div className="flex items-center gap-3 p-3 bg-[#14213d]/40 rounded-xl border border-[#14213d]">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fca311] to-[#14213d] rounded-xl opacity-60"></div>
              <img
                src={authUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.fullName || 'User')}&background=fca311&color=14213d&bold=true`}
                alt={authUser.fullName}
                className="relative w-10 h-10 rounded-xl object-cover ring-2 ring-[#14213d]"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate text-sm">
                {authUser.fullName || 'User'}
              </h3>
              <p className="text-[#e5e5e5]/60 text-xs truncate">
                {authUser.nativeLanguage || 'Add language'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed User Avatar */}
      {isCollapsed && authUser && (
        <div className="p-4 border-b border-[#14213d] flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#fca311] to-[#14213d] rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <img
              src={authUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.fullName || 'User')}&background=fca311&color=14213d&bold=true`}
              alt={authUser.fullName}
              className="relative w-10 h-10 rounded-xl object-cover ring-2 ring-[#14213d] group-hover:ring-[#fca311]/50 transition-all duration-200"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path));
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`relative flex items-center w-full p-3 rounded-xl font-medium transition-all duration-200 ease-out group overflow-hidden
                ${isActive
                  ? 'bg-gradient-to-r from-[#fca311]/20 to-[#fca311]/10 text-[#fca311] border-l-2 border-[#fca311] shadow-lg shadow-[#fca311]/10'
                  : 'text-[#e5e5e5]/60 hover:bg-[#14213d]/40 hover:text-[#fca311] hover:border-l-2 hover:border-[#fca311]/30'
                } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.name : ''}
            >
              {/* Active state glow effect */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#fca311]/5 to-transparent rounded-xl"></div>
              )}
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#fca311]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <item.Icon className={`w-5 h-5 relative z-10 transition-transform duration-200 ${
                isActive ? 'scale-110' : 'group-hover:scale-105'
              }`} />
              
              {!isCollapsed && (
                <span className="ml-3 relative z-10 font-semibold">{item.name}</span>
              )}

              {/* Active indicator dot for collapsed state */}
              {isCollapsed && isActive && (
                <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-[#fca311] rounded-full transform -translate-y-1/2"></div>
              )}
            </button>
          );
        })}
      </nav>

     

      {/* Collapsed Version Info */}
      {isCollapsed && (
        <div className="p-4 border-t border-[#14213d]">
          <p className="text-xs text-[#e5e5e5]/40 text-center rotate-180" style={{ writingMode: 'vertical-rl' }}>
            v1.0
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;