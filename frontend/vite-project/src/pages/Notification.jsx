import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { 
  Bell, 
  Clock, 
  MessageCircle, 
  UserCheck, 
  UserPlus,
  Check,
  Loader2,
  Users
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend request accepted!");
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.message || "Failed to accept request";
      toast.error(msg);
    },
  });

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];

  // Skeleton Loader
  const NotificationSkeleton = () => (
    <div className="bg-[#14213d]/40 backdrop-blur-xl rounded-2xl p-6 border border-[#14213d] animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-[#14213d] rounded-2xl"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-[#14213d] rounded w-3/4"></div>
          <div className="h-3 bg-[#14213d] rounded w-1/2"></div>
          <div className="h-8 bg-[#14213d] rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] to-[#14213d] p-4 sm:p-6 lg:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fca311]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#14213d]/50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Enhanced Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <Bell className="w-8 h-8 text-[#fca311] animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#fca311] via-[#e5e5e5] to-[#ffffff] mb-4 tracking-tight">
            Notifications
          </h1>
          <p className="text-[#e5e5e5] text-lg max-w-2xl mx-auto leading-relaxed">
            Manage your friend requests and connection updates
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#14213d]/40 backdrop-blur-xl rounded-2xl p-6 border border-[#14213d]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#fca311]/10 rounded-xl">
                <UserPlus className="w-6 h-6 text-[#fca311]" />
              </div>
              <div>
                <p className="text-[#e5e5e5] text-sm">Pending Requests</p>
                <p className="text-2xl font-bold text-white">{incomingRequests.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#14213d]/40 backdrop-blur-xl rounded-2xl p-6 border border-[#14213d]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#fca311]/10 rounded-xl">
                <Users className="w-6 h-6 text-[#fca311]" />
              </div>
              <div>
                <p className="text-[#e5e5e5] text-sm">New Connections</p>
                <p className="text-2xl font-bold text-white">{acceptedRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Friend Requests Section */}
            {incomingRequests.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-[#fca311]/10 rounded-xl">
                      <UserCheck className="w-6 h-6 text-[#fca311]" />
                    </div>
                    Friend Requests
                  </h2>
                  <span className="px-3 py-1 bg-[#fca311]/10 text-[#fca311] text-sm rounded-full border border-[#fca311]/20">
                    {incomingRequests.length} pending
                  </span>
                </div>

                <div className="space-y-4">
                  {incomingRequests.map((request) => (
                    <div key={request._id} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#fca311] to-[#fca311]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                      <div className="relative bg-[#14213d]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#14213d] hover:border-[#fca311]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#fca311]/10 group-hover:-translate-y-0.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#fca311] to-[#14213d] rounded-2xl opacity-60"></div>
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                                className="relative w-14 h-14 rounded-2xl object-cover ring-2 ring-[#14213d] group-hover:ring-[#fca311]/50 transition-all duration-300"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    request.sender.fullName
                                  )}&background=fca311&color=14213d&bold=true&size=56`;
                                }}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-white group-hover:text-[#fca311] transition-colors duration-200">
                                {request.sender.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-2.5 py-1 bg-[#fca311]/10 text-[#fca311] text-xs rounded-lg border border-[#fca311]/20 font-medium">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="px-2.5 py-1 bg-[#14213d] text-[#e5e5e5] text-xs rounded-lg border border-[#14213d] font-medium">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                              <p className="text-[#e5e5e5] text-sm mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Wants to connect with you
                              </p>
                            </div>
                          </div>

                          <button
                            className="bg-gradient-to-r from-[#fca311] to-[#fca311]/90 hover:from-[#fca311] hover:to-[#fca311] text-[#000000] py-2.5 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#fca311]/20 hover:shadow-xl hover:shadow-[#fca311]/30 hover:scale-105 min-w-[120px]"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            {isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Accepting...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                Accept
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accepted Requests Section */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-[#fca311]/10 rounded-xl">
                      <Users className="w-6 h-6 text-[#fca311]" />
                    </div>
                    New Connections
                  </h2>
                  <span className="px-3 py-1 bg-[#fca311]/10 text-[#fca311] text-sm rounded-full border border-[#fca311]/20">
                    {acceptedRequests.length} new
                  </span>
                </div>

                <div className="space-y-4">
                  {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#fca311] to-[#fca311]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-10 transition-all duration-500"></div>
                      <div className="relative bg-[#14213d]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#14213d] hover:border-[#fca311]/30 transition-all duration-300 group-hover:-translate-y-0.5">
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#fca311] to-[#14213d] rounded-2xl opacity-60"></div>
                            <img
                              src={notification.recipient?.profilePic || "/default-avatar.png"}
                              alt={notification.recipient?.fullName || "User"}
                              className="relative w-12 h-12 rounded-2xl object-cover ring-2 ring-[#14213d] group-hover:ring-[#fca311]/30 transition-all duration-300"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  notification.recipient?.fullName || "User"
                                )}&background=fca311&color=14213d&bold=true&size=48`;
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-[#fca311] transition-colors duration-200">
                                  {notification.recipient?.fullName || "Unknown User"}
                                </h3>
                                <p className="text-[#e5e5e5] text-sm mt-1">
                                  {notification.recipient?.fullName || "Someone"} accepted your friend request
                                </p>
                              </div>
                              <span className="px-3 py-1.5 bg-[#fca311]/10 text-[#fca311] text-xs rounded-lg border border-[#fca311]/20 font-medium flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                Connected
                              </span>
                            </div>
                            <p className="text-[#e5e5e5]/60 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Recently
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="flex justify-center items-center py-16">
                <NoNotificationsFound />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;