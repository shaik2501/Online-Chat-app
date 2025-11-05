import React from "react";
import { useAuthUser } from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, MessageCircle, Home, Users, Bell, Video, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error("Logout failed. Please try again.");
    },
  });

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path.startsWith("/chat")) return "Messages";
    if (path.startsWith("/friends")) return "Connections";
    if (path.startsWith("/notifications")) return "Notifications";
    if (path.startsWith("/call")) return "Video Call";
    return "LinguaConnect";
  };

  const getPageIcon = () => {
    const path = location.pathname;
    if (path === "/") return <Home className="w-5 h-5" />;
    if (path.startsWith("/chat")) return <MessageCircle className="w-5 h-5" />;
    if (path.startsWith("/friends")) return <Users className="w-5 h-5" />;
    if (path.startsWith("/notifications")) return <Bell className="w-5 h-5" />;
    if (path.startsWith("/call")) return <Video className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  const pageTitle = getPageTitle();
  const PageIcon = getPageIcon();

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#000000]/80 backdrop-blur-xl border-b border-[#14213d] shadow-2xl shadow-[#000000]/50">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Left: Page Title with Icon */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#fca311]/10 rounded-xl border border-[#fca311]/20">
            {PageIcon}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              {pageTitle}
              {location.pathname.startsWith("/chat") && (
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              )}
            </h1>
            <p className="text-[#e5e5e5]/60 text-sm">
              {location.pathname === "/" && "Welcome to your language learning hub"}
              {location.pathname.startsWith("/chat") && "Real-time messaging"}
              {location.pathname.startsWith("/friends") && "Manage your connections"}
              {location.pathname.startsWith("/notifications") && "Stay updated"}
              {location.pathname.startsWith("/call") && "Live video communication"}
            </p>
          </div>
        </div>

        {/* Right: User Info and Actions */}
        <div className="flex items-center gap-4">
          {/* User Profile */}
          <div className="flex items-center gap-3 p-2 bg-[#14213d]/40 rounded-xl border border-[#14213d] hover:border-[#fca311]/30 transition-all duration-200 group cursor-pointer">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fca311] to-[#14213d] rounded-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <img
                src={authUser?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullName || 'User')}&background=fca311&color=14213d&bold=true`}
                alt={authUser?.fullName || "User"}
                className="relative w-10 h-10 rounded-xl object-cover ring-2 ring-[#14213d] group-hover:ring-[#fca311]/50 transition-all duration-200"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullName || 'User')}&background=fca311&color=14213d&bold=true`;
                }}
              />
              {/* Online Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#000000]"></div>
            </div>
            
            <div className="hidden md:block min-w-0">
              <p className="font-semibold text-white text-sm truncate max-w-[120px]">
                {authUser?.fullName || "User"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {authUser?.nativeLanguage && (
                  <span className="px-2 py-0.5 bg-[#fca311]/10 text-[#fca311] text-xs rounded-lg border border-[#fca311]/20 font-medium">
                    {authUser.nativeLanguage}
                  </span>
                )}
                {authUser?.learningLanguage && (
                  <span className="px-2 py-0.5 bg-[#14213d] text-[#e5e5e5] text-xs rounded-lg border border-[#14213d] font-medium">
                    {authUser.learningLanguage}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => logoutMutation()}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 transition-all duration-200 font-semibold group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Progress Bar for Loading States */}
      {isPending && (
        <div className="w-full h-0.5 bg-gradient-to-r from-red-500 to-red-400 animate-pulse"></div>
      )}
    </nav>
  );
};

export default Navbar;