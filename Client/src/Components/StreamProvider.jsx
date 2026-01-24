import React, { createContext, useContext } from "react";
import { Chat } from "stream-chat-react";
import { StreamVideo } from "@stream-io/video-react-sdk";
import { useStreamClient } from "../Hooks/useStreamClient";
import { LuLoader } from "react-icons/lu";

// Import Stream CSS
import "stream-chat-react/dist/css/v2/index.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const StreamContext = createContext(null);

export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStream must be used within a StreamProvider");
  }
  return context;
};

export const StreamProvider = ({ children }) => {
  const { chatClient, videoClient, isLoading, error } = useStreamClient();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="flex flex-col items-center gap-4">
          <LuLoader className="h-8 w-8 text-primary animate-spin" />
          <p className="text-base-content/60">Connecting to Stream...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <p className="text-error font-medium">Failed to connect to Stream</p>
          <p className="text-base-content/60 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!chatClient || !videoClient) {
    return children;
  }

  return (
    <StreamContext.Provider value={{ chatClient, videoClient }}>
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <StreamVideo client={videoClient}>{children}</StreamVideo>
      </Chat>
    </StreamContext.Provider>
  );
};
