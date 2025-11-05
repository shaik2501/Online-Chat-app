import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuthUser } from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { Video, Users, PhoneOff, Mic, MicOff, Camera, CameraOff, MessageCircle } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000000] to-[#14213d] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#fca311]/20 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative bg-[#14213d]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#14213d]">
              <Video className="w-12 h-12 text-[#fca311] animate-pulse mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Joining Call</h3>
              <p className="text-[#e5e5e5]/60">Setting up your video connection...</p>
            </div>
          </div>
          <PageLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] to-[#14213d]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fca311]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#14213d]/50 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#fca311]/10 rounded-xl">
              <Video className="w-6 h-6 text-[#fca311]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">LinguaConnect Call</h1>
              <p className="text-[#e5e5e5]/60 text-sm">Room: {callId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#14213d]/60 rounded-xl border border-[#14213d]">
            <Users className="w-4 h-4 text-[#fca311]" />
            <span className="text-white text-sm font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Main Call Content */}
      <div className="relative z-10 h-[calc(100vh-120px)]">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamTheme className="str-video__theme-dark">
              <StreamCall call={call}>
                <EnhancedCallContent />
              </StreamCall>
            </StreamTheme>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="p-4 bg-[#14213d]/60 backdrop-blur-xl rounded-2xl border border-[#14213d] max-w-md">
                <Video className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Call Unavailable</h3>
                <p className="text-[#e5e5e5]/60 mb-4">
                  Could not initialize the call. Please check your connection and try again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#fca311] text-[#000000] px-6 py-2 rounded-xl font-semibold hover:bg-[#fca311]/90 transition-all duration-200"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EnhancedCallContent = () => {
  const { useCallCallingState, useParticipants, useMicrophoneState, useCameraState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const { microphone, isMute } = useMicrophoneState();
  const { camera, isEnabled } = useCameraState();
  
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) {
    setTimeout(() => navigate("/"), 2000);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="p-6 bg-[#14213d]/60 backdrop-blur-xl rounded-2xl border border-[#14213d] max-w-md">
            <PhoneOff className="w-12 h-12 text-[#fca311] mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-white mb-2">Call Ended</h3>
            <p className="text-[#e5e5e5]/60">Returning to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Speaker Layout */}
      <div className="flex-1 relative">
        <SpeakerLayout />
        
        {/* Participant Count Overlay */}
        <div className="absolute top-4 right-4 bg-[#000000]/60 backdrop-blur-xl rounded-xl px-3 py-2 border border-[#14213d]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#fca311]" />
            <span className="text-white text-sm font-medium">
              {participants.length + 1} {participants.length + 1 === 1 ? 'person' : 'people'}
            </span>
          </div>
        </div>

        {/* Connection Status */}
        <div className="absolute top-4 left-4 bg-[#000000]/60 backdrop-blur-xl rounded-xl px-3 py-2 border border-[#14213d]">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              callingState === CallingState.JOINED ? 'bg-green-500' : 
              callingState === CallingState.JOINING ? 'bg-yellow-500 animate-pulse' : 
              'bg-red-500'
            }`}></div>
            <span className="text-white text-sm font-medium capitalize">
              {callingState.toLowerCase().replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Controls */}
      <div className="p-6 bg-[#14213d]/40 backdrop-blur-xl border-t border-[#14213d]">
        <div className="max-w-4xl mx-auto">
          {/* Quick Controls */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => microphone.toggle()}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isMute 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-[#fca311]/10 text-[#fca311] border border-[#fca311]/20 hover:bg-[#fca311]/20'
              }`}
            >
              {isMute ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => camera.toggle()}
              className={`p-3 rounded-xl transition-all duration-200 ${
                !isEnabled 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-[#fca311]/10 text-[#fca311] border border-[#fca311]/20 hover:bg-[#fca311]/20'
              }`}
            >
              {!isEnabled ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </button>
            
            <button className="p-3 bg-[#fca311]/10 text-[#fca311] rounded-xl border border-[#fca311]/20 hover:bg-[#fca311]/20 transition-all duration-200">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Main Call Controls */}
          <div className="flex justify-center">
            <CallControls />
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom CSS to override Stream's default styles
const customCallStyles = `
.str-video__theme-dark {
  --str-video__background-color: transparent !important;
  --str-video__primary-color: #fca311 !important;
  --str-video__text-color1: #ffffff !important;
  --str-video__text-color2: #e5e5e5 !important;
  --str-video__text-color3: #a0a0a0 !important;
}

.str-video__call {
  background: transparent !important;
}

.str-video__call-panel {
  background: transparent !important;
}

.str-video__speaker-layout {
  background: transparent !important;
}

.str-video__participant-details {
  background: #14213d/80 !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid #14213d !important;
  border-radius: 12px !important;
}

.str-video__participant-list {
  background: #14213d/80 !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid #14213d !important;
}

.str-video__call-controls__button {
  background: #14213d !important;
  border: 1px solid #14213d !important;
  color: #e5e5e5 !important;
  border-radius: 12px !important;
  transition: all 0.2s ease !important;
}

.str-video__call-controls__button:hover {
  background: #fca311 !important;
  color: #000000 !important;
  transform: scale(1.05) !important;
}

.str-video__call-controls__button--active {
  background: #fca311 !important;
  color: #000000 !important;
}

.str-video__call-controls__button--leave {
  background: #ef4444 !important;
  color: #ffffff !important;
}

.str-video__call-controls__button--leave:hover {
  background: #dc2626 !important;
  transform: scale(1.05) !important;
}

.str-video__participant-view {
  background: #14213d/60 !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid #14213d !important;
  border-radius: 16px !important;
}

.str-video__video-wrapper {
  border-radius: 16px !important;
}

.str-video__screen-share-container {
  background: #14213d/80 !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid #14213d !important;
  border-radius: 16px !important;
}
`;

// Inject custom styles
const styleSheet = document.createElement("style");
styleSheet.innerText = customCallStyles;
document.head.appendChild(styleSheet);

export default CallPage;