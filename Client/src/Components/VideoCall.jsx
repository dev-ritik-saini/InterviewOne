import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCall,
  useCallStateHooks,
  CallingState,
  StreamCall,
  SpeakerLayout,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { LuLoader } from "react-icons/lu";
import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsMic,
  BsMicMute,
  BsTelephoneX,
} from "react-icons/bs";

const CustomCallControls = () => {
  const call = useCall();
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  const { camera, isMute: isCameraMuted } = useCameraState();

  const toggleMic = async () => {
    await microphone.toggle();
  };

  const toggleCamera = async () => {
    await camera.toggle();
  };

  const leaveCall = async () => {
    await call?.leave();
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Microphone Toggle */}
      <button
        onClick={toggleMic}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isMicMuted
            ? "bg-error text-white hover:bg-error/80"
            : "bg-base-200 text-base-content hover:bg-base-100"
        }`}
        title={isMicMuted ? "Unmute" : "Mute"}
      >
        {isMicMuted ? (
          <BsMicMute className="w-5 h-5" />
        ) : (
          <BsMic className="w-5 h-5" />
        )}
      </button>

      {/* Camera Toggle */}
      <button
        onClick={toggleCamera}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isCameraMuted
            ? "bg-error text-white hover:bg-error/80"
            : "bg-base-200 text-base-content hover:bg-base-100"
        }`}
        title={isCameraMuted ? "Turn on camera" : "Turn off camera"}
      >
        {isCameraMuted ? (
          <BsCameraVideoOff className="w-5 h-5" />
        ) : (
          <BsCameraVideo className="w-5 h-5" />
        )}
      </button>

      {/* Leave Call */}
      <button
        onClick={leaveCall}
        className="w-12 h-12 rounded-full bg-error text-white flex items-center justify-center hover:bg-error/80 transition-all"
        title="Leave call"
      >
        <BsTelephoneX className="w-5 h-5" />
      </button>
    </div>
  );
};

const VideoCallUI = () => {
  const call = useCall();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/dashboard");
    }
  }, [callingState, navigate]);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-300/50">
        <div className="text-center">
          <LuLoader className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-base-content/60 text-sm">Joining call...</p>
        </div>
      </div>
    );
  }

  if (callingState === CallingState.LEFT) {
    // Optionally render nothing or a loader while redirecting
    return null;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Video Grid */}
      <div className="flex-1 relative min-h-0 overflow-hidden">
        <SpeakerLayout participantsBarPosition="bottom" />
      </div>

      {/* Custom Call Controls */}
      <div className="shrink-0 p-4 bg-base-300 border-t border-base-200 flex justify-center">
        <CustomCallControls />
      </div>
    </div>
  );
};

const VideoCall = ({ callId }) => {
  const videoClient = useStreamVideoClient();
  const [call, setCall] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const callRef = useRef(null);

  useEffect(() => {
    if (!videoClient || !callId) return;

    let isMounted = true;

    const joinCall = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const newCall = videoClient.call("default", callId);
        await newCall.join({ create: false });

        if (!isMounted) {
          newCall.leave().catch(console.error);
          return;
        }

        callRef.current = newCall;
        setCall(newCall);
        setIsLoading(false);
      } catch (err) {
        console.error("Error joining call:", err);
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };

    joinCall();

    return () => {
      isMounted = false;
      if (callRef.current) {
        callRef.current.leave().catch(console.error);
        callRef.current = null;
      }
    };
  }, [videoClient, callId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-300/50">
        <div className="text-center">
          <LuLoader className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-base-content/60 text-sm">Connecting to video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-300/50">
        <div className="text-center">
          <BsCameraVideoOff className="h-10 w-10 text-error mx-auto mb-3" />
          <p className="text-error text-sm font-medium">Failed to join call</p>
          <p className="text-base-content/40 text-xs mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-300/50">
        <div className="text-center">
          <BsCameraVideo className="h-10 w-10 text-primary mx-auto mb-3" />
          <p className="text-base-content/60 text-sm">No active call</p>
        </div>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <VideoCallUI />
    </StreamCall>
  );
};

export default VideoCall;
