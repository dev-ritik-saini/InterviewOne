import React, { useEffect, useState } from "react";
import {
  useCall,
  useCallStateHooks,
  CallingState,
  StreamCall,
  SpeakerLayout,
  CallControls,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { LuLoader } from "react-icons/lu";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";

const VideoCallUI = () => {
  const call = useCall();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

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
    return (
      <div className="flex-1 flex items-center justify-center bg-base-300/50">
        <div className="text-center">
          <BsCameraVideoOff className="h-10 w-10 text-base-content/40 mx-auto mb-3" />
          <p className="text-base-content/60 text-sm">You left the call</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Video Grid */}
      <div className="flex-1 relative">
        <SpeakerLayout participantsBarPosition="bottom" />
      </div>

      {/* Call Controls */}
      <div className="p-2 bg-base-300/80 border-t border-base-300">
        <CallControls />
      </div>
    </div>
  );
};

const VideoCall = ({ callId }) => {
  const videoClient = useStreamVideoClient();
  const [call, setCall] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoClient || !callId) return;

    const joinCall = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const newCall = videoClient.call("default", callId);
        await newCall.join({ create: false });
        setCall(newCall);
        setIsLoading(false);
      } catch (err) {
        console.error("Error joining call:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    joinCall();

    return () => {
      if (call) {
        call.leave().catch(console.error);
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
