import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom"; 
import {
  Search,
  Users,
  Globe,
  MessageCircle,
  UserPlus,
  Check,
  Loader2,
  X,
  Filter,
  Sparkles,
} from "lucide-react";
import {
  getUserFriends,
  getRecommendedUsers,
  getOutgoingFriendReqs,
  sendFriendRequest,
} from "../lib/api";
import toast from "react-hot-toast";

const Home = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ✅ Fetch user's friends
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // ✅ Fetch recommended users
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  // ✅ Fetch outgoing friend requests
  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  // ✅ Mutation for sending friend requests
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      toast.success("Friend request sent successfully");
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || err.message || "Failed to send request";
      toast.error(msg);
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        if (req.recipent?._id) outgoingIds.add(req.recipent._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // ✅ Get all unique languages for filter
  const allLanguages = useMemo(() => {
    const langs = new Set();
    [...friends, ...recommendedUsers].forEach((user) => {
      if (user.nativeLanguage) langs.add(user.nativeLanguage);
      if (user.learningLanguage) langs.add(user.learningLanguage);
    });
    return Array.from(langs).sort();
  }, [friends, recommendedUsers]);

  // ✅ Filters for friends
  const filteredFriends = useMemo(() => {
    return friends.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLanguage =
        filterLanguage === "all" ||
        user.nativeLanguage === filterLanguage ||
        user.learningLanguage === filterLanguage;

      return matchesSearch && matchesLanguage;
    });
  }, [friends, searchQuery, filterLanguage]);

  // ✅ Filters for recommended users
  const filteredRecommended = useMemo(() => {
    return recommendedUsers.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLanguage =
        filterLanguage === "all" ||
        user.nativeLanguage === filterLanguage ||
        user.learningLanguage === filterLanguage;

      return matchesSearch && matchesLanguage;
    });
  }, [recommendedUsers, searchQuery, filterLanguage]);

  // ✅ Send friend request handler
  const handleSendRequest = (userId) => {
    if (!userId) return toast.error("Invalid user ID");
    sendRequestMutation(userId);
  };

  // ✅ Skeleton Loader
  const UserCardSkeleton = () => (
    <div className="bg-[#14213d]/40 backdrop-blur-xl rounded-2xl p-6 border border-[#14213d] animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-[#14213d] rounded-2xl"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-[#14213d] rounded w-3/4"></div>
          <div className="h-3 bg-[#14213d] rounded w-1/2"></div>
          <div className="h-3 bg-[#14213d] rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );

  // ✅ User Card Component
  const UserCard = ({ user, type = "recommended" }) => {
    const isRequestSent =
      outgoingRequestsIds.has(user._id) || outgoingRequestsIds.has(user.id);

    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#fca311] to-[#fca311]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
        <div className="relative bg-[#14213d]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#14213d] hover:border-[#fca311]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#fca311]/10 group-hover:-translate-y-1">
          <div className="flex items-start space-x-4">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fca311] to-[#14213d] rounded-2xl opacity-60"></div>
              <img
                src={user.profilePic}
                alt={user.fullName}
                className="relative w-16 h-16 rounded-2xl object-cover ring-2 ring-[#14213d] group-hover:ring-[#fca311]/50 transition-all duration-300"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.fullName
                  )}&background=fca311&color=14213d&bold=true&size=64`;
                }}
              />
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#14213d] ring-1 ring-[#fca311]"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate group-hover:text-[#fca311] transition-colors duration-200">
                    {user.fullName}
                  </h3>
                  <p className="text-sm text-[#e5e5e5] truncate mt-0.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-[#fca311] rounded-full"></span>
                    {user.location}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {user.nativeLanguage && (
                  <span className="px-3 py-1.5 bg-[#fca311]/10 text-[#fca311] text-xs rounded-xl border border-[#fca311]/20 font-medium backdrop-blur-sm">
                    Native: {user.nativeLanguage}
                  </span>
                )}
                {user.learningLanguage && (
                  <span className="px-3 py-1.5 bg-[#14213d] text-[#e5e5e5] text-xs rounded-xl border border-[#14213d] font-medium backdrop-blur-sm">
                    Learning: {user.learningLanguage}
                  </span>
                )}
              </div>

              <p className="text-[#e5e5e5] text-sm line-clamp-2 leading-relaxed mb-4">
                {user.bio}
              </p>

              <div className="flex gap-2">
                {type === "friends" ? (
                  <Link to={`/chat/${user._id}`} className="flex-1">
                    <button className="w-full bg-gradient-to-r from-[#fca311] to-[#fca311]/90 hover:from-[#fca311] hover:to-[#fca311] text-[#000000] py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#fca311]/20 hover:shadow-xl hover:shadow-[#fca311]/30 hover:scale-105">
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleSendRequest(user._id)}
                    disabled={isPending || isRequestSent}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      isRequestSent
                        ? "bg-[#14213d] text-[#e5e5e5] cursor-not-allowed border border-[#14213d]"
                        : "bg-gradient-to-r from-[#fca311] to-[#fca311]/90 hover:from-[#fca311] hover:to-[#fca311] text-[#000000] shadow-lg shadow-[#fca311]/20 hover:shadow-xl hover:shadow-[#fca311]/30 hover:scale-105"
                    }`}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : isRequestSent ? (
                      <>
                        <Check className="w-4 h-4" />
                        Request Sent
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] to-[#14213d] p-4 sm:p-6 lg:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fca311]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#14213d]/50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* ✨ Enhanced Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <Sparkles className="w-8 h-8 text-[#fca311] animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#fca311] via-[#e5e5e5] to-[#ffffff] mb-4 tracking-tight">
            ChatGuy
          </h1>
          <p className="text-[#e5e5e5] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Connect with language enthusiasts worldwide and master new languages together
          </p>
        </div>

        {/* Enhanced Search and Filter UI */}
        <div className="mb-12 bg-[#14213d]/40 backdrop-blur-xl rounded-2xl p-6 border border-[#14213d] shadow-2xl shadow-[#000000]/50">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* 🔍 Enhanced Search */}
            <div className="flex-1 relative min-w-0">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-[#fca311]" />
              </div>
              <input
                type="text"
                placeholder="Search by name, location, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#000000]/60 text-white placeholder-[#e5e5e5]/60 pl-12 pr-10 py-4 rounded-xl border border-[#14213d] focus:border-[#fca311] focus:outline-none focus:ring-2 focus:ring-[#fca311]/20 transition-all duration-200 backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#e5e5e5] hover:text-[#fca311] transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* 🌐 Enhanced Language Filter */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="w-48 bg-[#000000]/60 text-white pl-4 pr-10 py-4 rounded-xl border border-[#14213d] focus:border-[#fca311] focus:outline-none focus:ring-2 focus:ring-[#fca311]/20 transition-all duration-200 backdrop-blur-sm cursor-pointer appearance-none"
                >
                  <option value="all">All Languages</option>
                  {allLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Filter className="w-4 h-4 text-[#fca311]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Sections with Stats */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Stats Cards */}
          <div className="bg-[#14213d]/40 backdrop-blur-xl rounded-2xl p-6 border border-[#14213d]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#fca311]/10 rounded-xl">
                  <Users className="w-6 h-6 text-[#fca311]" />
                </div>
                <div>
                  <p className="text-[#e5e5e5] text-sm">Total Friends</p>
                  <p className="text-2xl font-bold text-white">{friends.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#e5e5e5] text-sm">Available</p>
                <p className="text-lg font-semibold text-[#fca311]">
                  {friends.filter(f => f.isOnline).length} online
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#14213d]/40 backdrop-blur-xl rounded-2xl p-6 border border-[#14213d]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#fca311]/10 rounded-xl">
                  <Globe className="w-6 h-6 text-[#fca311]" />
                </div>
                <div>
                  <p className="text-[#e5e5e5] text-sm">Discover</p>
                  <p className="text-2xl font-bold text-white">{recommendedUsers.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#e5e5e5] text-sm">Languages</p>
                <p className="text-lg font-semibold text-[#fca311]">
                  {allLanguages.length} total
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Sections */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Friends Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-[#fca311]/10 rounded-xl">
                  <Users className="w-6 h-6 text-[#fca311]" />
                </div>
                Your Connections
              </h2>
              <span className="px-3 py-1 bg-[#fca311]/10 text-[#fca311] text-sm rounded-full border border-[#fca311]/20">
                {filteredFriends.length} users
              </span>
            </div>
            
            <div className="space-y-6">
              {loadingFriends ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <UserCardSkeleton key={i} />
                ))
              ) : filteredFriends.length === 0 &&
                (searchQuery !== "" || filterLanguage !== "all") ? (
                <div className="text-center py-12 border-2 border-dashed border-[#14213d] rounded-2xl bg-[#14213d]/20">
                  <Users className="w-12 h-12 text-[#14213d] mx-auto mb-4" />
                  <p className="text-[#e5e5e5] text-lg mb-2">No matches found</p>
                  <p className="text-[#e5e5e5]/60 text-sm">Try adjusting your search or filters</p>
                </div>
              ) : filteredFriends.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[#14213d] rounded-2xl bg-[#14213d]/20">
                  <Users className="w-12 h-12 text-[#14213d] mx-auto mb-4" />
                  <p className="text-[#e5e5e5] text-lg mb-2">No connections yet</p>
                  <p className="text-[#e5e5e5]/60 text-sm">Start connecting with people in Discover</p>
                </div>
              ) : (
                filteredFriends.map((friend) => (
                  <UserCard key={friend._id} user={friend} type="friends" />
                ))
              )}
            </div>
          </div>

          {/* Discover Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-[#fca311]/10 rounded-xl">
                  <Globe className="w-6 h-6 text-[#fca311]" />
                </div>
                Discover Learners
              </h2>
              <span className="px-3 py-1 bg-[#fca311]/10 text-[#fca311] text-sm rounded-full border border-[#fca311]/20">
                {filteredRecommended.length} users
              </span>
            </div>
            
            <div className="space-y-6">
              {loadingUsers ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <UserCardSkeleton key={i} />
                ))
              ) : filteredRecommended.length === 0 &&
                (searchQuery !== "" || filterLanguage !== "all") ? (
                <div className="text-center py-12 border-2 border-dashed border-[#14213d] rounded-2xl bg-[#14213d]/20">
                  <Globe className="w-12 h-12 text-[#14213d] mx-auto mb-4" />
                  <p className="text-[#e5e5e5] text-lg mb-2">No users found</p>
                  <p className="text-[#e5e5e5]/60 text-sm">Try different search terms or filters</p>
                </div>
              ) : filteredRecommended.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[#14213d] rounded-2xl bg-[#14213d]/20">
                  <Globe className="w-12 h-12 text-[#14213d] mx-auto mb-4" />
                  <p className="text-[#e5e5e5] text-lg mb-2">No recommendations</p>
                  <p className="text-[#e5e5e5]/60 text-sm">Check back later for new connections</p>
                </div>
              ) : (
                filteredRecommended.map((user) => (
                  <UserCard key={user._id} user={user} type="recommended" />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;