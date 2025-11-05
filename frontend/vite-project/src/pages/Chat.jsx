import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { getStreamToken } from "../lib/api"; 
import { useAuthUser } from "../hooks/useAuthUser"; 
import PageLoader from "../components/PageLoader";
import CallButton from "../components/CallButton";
import toast from "react-hot-toast";
import { ArrowLeft, Video, MessageCircle, Users, Phone } from "lucide-react";

// Enhanced Chat Error State Component
const ChatErrorState = ({ message, onBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-[#000000] to-[#14213d] flex items-center justify-center p-6">
    <div className="bg-[#14213d]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#14213d] shadow-2xl shadow-[#000000]/50 max-w-md w-full text-center">
      <div className="w-16 h-16 bg-[#fca311]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <MessageCircle className="w-8 h-8 text-[#fca311]" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Chat Unavailable</h2>
      <p className="text-[#e5e5e5] mb-6">{message}</p>
      <div className="flex flex-col gap-3">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#fca311] text-[#000000] rounded-xl font-semibold hover:bg-[#fca311]/90 transition-all duration-200 shadow-lg shadow-[#fca311]/20 hover:shadow-xl hover:shadow-[#fca311]/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#14213d] text-[#e5e5e5] rounded-xl font-semibold border border-[#14213d] hover:border-[#fca311]/50 transition-all duration-200"
        >
          Try Reloading
        </button>
      </div>
    </div>
  </div>
);

const ChatPage = () => {
  const { userId } = useParams(); 
  const { authUser } = useAuthUser(); 
  const navigate = useNavigate();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otherUser, setOtherUser] = useState(null);

  const API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  const handleGoBack = () => {
    navigate(-1);
  };

  const initChat = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    if (!authUser?._id) {
        setError("Logged-in user data is missing.");
        setLoading(false);
        return;
    }
    if (!userId) {
        setError("Target User ID is missing from the URL.");
        setLoading(false);
        return;
    }
    if (!API_KEY) {
        setError("Stream API Key is not configured in environment variables.");
        setLoading(false);
        return;
    }

    let clientInstance; 
    
    try {
      const { token } = await getStreamToken(authUser._id);
      clientInstance = StreamChat.getInstance(API_KEY);

      if (!clientInstance.userID) {
        await clientInstance.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName || authUser.username || `User ${authUser._id.substring(0, 4)}`,
            image: authUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.fullName || "User")}&background=fca311&color=14213d&bold=true`,
          },
          token
        );
      }

      const channelId = [authUser._id, userId].sort().join("-");
      const newChannel = clientInstance.channel("messaging", channelId, {
        members: [authUser._id, userId],
        name: `Chat with ${userId}`,
      });

      await newChannel.watch();
      
      // Get other user's info from channel state
      const otherMember = Object.values(newChannel.state.members).find(
        member => member.user.id === userId
      );
      if (otherMember?.user) {
        setOtherUser(otherMember.user);
      }
      
      setChatClient(clientInstance);
      setChannel(newChannel);
      setError(null);
    } catch (err) {
      console.error("Error initializing Stream Chat:", err);
      setError(err.message || "Failed to connect to Stream Chat.");
    } finally {
      setLoading(false);
    }
  }, [authUser?._id, userId, API_KEY]);

  useEffect(() => {
    if (authUser?._id && userId && API_KEY) {
        initChat();
    }
    
    return () => {
      if (chatClient) {
        chatClient.disconnectUser().catch(console.error);
      }
    };
  }, [initChat, authUser?._id, userId, API_KEY, chatClient]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
        attachments: [
          {
            type: 'video',
            url: callUrl,
            title: 'Video Call Link'
          }
        ]
      });
      toast.success("Video call invitation sent!");
    }
  };

  const handleVoiceCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}?audio=true`;
      channel.sendMessage({
        text: `I've started a voice call. Join me here: ${callUrl}`,
        attachments: [
          {
            type: 'audio',
            url: callUrl,
            title: 'Voice Call Link'
          }
        ]
      });
      toast.success("Voice call invitation sent!");
    }
  };

  if (loading) return <PageLoader message="Connecting to chat..." />;

  if (error) {
    return <ChatErrorState message={`Initialization failed: ${error}`} onBack={handleGoBack} />;
  }

  if (!chatClient || !channel) {
    return <ChatErrorState message="Could not establish a connection or find the chat channel." onBack={handleGoBack} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#000000] to-[#14213d]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fca311]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#14213d]/50 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 border-r border-[#14213d] bg-[#000000]/60 backdrop-blur-xl p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={handleGoBack}
            className="flex items-center justify-center p-2 bg-[#14213d] text-[#e5e5e5] rounded-xl hover:bg-[#14213d]/80 hover:text-[#fca311] transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">Messages</h1>
        </div>

        {/* Current Chat Info */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#e5e5e5] mb-3 uppercase tracking-wider">Current Chat</h3>
          <div className="bg-[#14213d]/60 backdrop-blur-xl rounded-2xl p-4 border border-[#14213d]">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#fca311] to-[#14213d] rounded-xl opacity-60"></div>
                <img
                  src={otherUser?.image || `https://ui-avatars.com/api/?name=User&background=fca311&color=14213d&bold=true`}
                  alt={otherUser?.name || "User"}
                  className="relative w-12 h-12 rounded-xl object-cover ring-2 ring-[#14213d]"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate">
                  {otherUser?.name || "Unknown User"}
                </h4>
                <p className="text-xs text-[#e5e5e5] truncate">Active now</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleVideoCall}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#fca311] text-[#000000] rounded-xl font-semibold text-sm hover:bg-[#fca311]/90 transition-all duration-200 shadow-lg shadow-[#fca311]/20"
              >
                <Video className="w-4 h-4" />
                Video
              </button>
              <button
                onClick={handleVoiceCall}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#14213d] text-[#e5e5e5] rounded-xl font-semibold text-sm border border-[#14213d] hover:border-[#fca311]/50 transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                Voice
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#e5e5e5] mb-3 uppercase tracking-wider">Quick Actions</h3>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#14213d]/40 text-[#e5e5e5] rounded-xl border border-[#14213d] hover:border-[#fca311]/50 hover:text-[#fca311] transition-all duration-200">
            <Users className="w-4 h-4" />
            <span className="font-medium">New Group Chat</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#14213d]/40 text-[#e5e5e5] rounded-xl border border-[#14213d] hover:border-[#fca311]/50 hover:text-[#fca311] transition-all duration-200">
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">Start New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col"> 
        <Chat client={chatClient} theme="str-chat__theme-dark">
          <Channel channel={channel}>
            <Window>
              <div className="str-chat__header-livestream">
                <ChannelHeader />
              </div>
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatPage;

// Custom CSS for Stream Chat Dark Theme
const customChatStyles = `
.str-chat__theme-dark {
  height: 100%;
  width: 100%;
  background: transparent !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
}

.str-chat__container {
  background: transparent !important;
}

.str-chat__main-panel {
  background: transparent !important;
}

.str-chat__header-livestream {
  background: #14213d/80 !important;
  backdrop-filter: blur(20px) !important;
  border-bottom: 1px solid #14213d !important;
  padding: 1rem 1.5rem !important;
}

.str-chat__message-list {
  background: transparent !important;
  padding: 1rem !important;
}

.str-chat__message-list-scroll-container {
  background: transparent !important;
}

.str-chat__list {
  background: transparent !important;
}

.str-chat__message-simple {
  background: transparent !important;
}

.str-chat__message-simple-wrapper--received .str-chat__message-simple__text-inner {
  background: #14213d/80 !important;
  backdrop-filter: blur(20px) !important;
  color: #e5e5e5 !important;
  border: 1px solid #14213d !important;
  border-radius: 18px 18px 18px 4px !important;
  padding: 12px 16px !important;
  font-size: 0.95rem !important;
  line-height: 1.4 !important;
}

.str-chat__message-simple-wrapper--mine .str-chat__message-simple__text-inner {
  background: linear-gradient(135deg, #fca311, #fca311/90) !important;
  color: #000000 !important;
  border-radius: 18px 18px 4px 18px !important;
  padding: 12px 16px !important;
  font-size: 0.95rem !important;
  line-height: 1.4 !important;
  font-weight: 500 !important;
}

.str-chat__input-panel {
  background: #14213d/80 !important;
  backdrop-filter: blur(20px) !important;
  border-top: 1px solid #14213d !important;
  padding: 1rem 1.5rem !important;
}

.str-chat__textarea {
  background: #000000/60 !important;
  border: 1px solid #14213d !important;
  border-radius: 16px !important;
  color: #e5e5e5 !important;
  font-size: 0.95rem !important;
}

.str-chat__textarea:focus {
  border-color: #fca311 !important;
  box-shadow: 0 0 0 2px #fca311/20 !important;
}

.str-chat__send-button {
  background: #fca311 !important;
  color: #000000 !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
}

.str-chat__send-button:hover {
  background: #fca311/90 !important;
}

.str-chat__message-actions-box {
  background: #14213d !important;
  border: 1px solid #14213d !important;
  border-radius: 12px !important;
}

.str-chat__thread {
  background: #000000/80 !important;
  backdrop-filter: blur(20px) !important;
  border-left: 1px solid #14213d !important;
}

.str-chat__avatar {
  border-radius: 12px !important;
}

.str-chat__message-simple-wrapper--mine .str-chat__avatar {
  display: none !important;
}

.str-chat__message-replies-count-button {
  color: #fca311 !important;
}

.str-chat__message-simple__actions {
  background: transparent !important;
}
`;

// Inject custom styles
const styleSheet = document.createElement("style");
styleSheet.innerText = customChatStyles;
document.head.appendChild(styleSheet);