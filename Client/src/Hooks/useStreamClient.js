import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { StreamChat } from "stream-chat";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { sessionApi } from "../api/sessions";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useStreamClient = () => {
  const { user, isLoaded } = useUser();
  const [chatClient, setChatClient] = useState(null);
  const [videoClient, setVideoClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) {
      setIsLoading(false);
      return;
    }

    const initClients = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get tokens from backend
        const { token, videoToken, userId, userName, userImage } =
          await sessionApi.getStreamToken();

        // Initialize Chat Client
        const chat = StreamChat.getInstance(STREAM_API_KEY);
        await chat.connectUser(
          {
            id: userId,
            name: userName || user.fullName || "User",
            image: userImage || user.imageUrl,
          },
          token
        );
        setChatClient(chat);

        // Initialize Video Client
        const video = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: userId,
            name: userName || user.fullName || "User",
            image: userImage || user.imageUrl,
          },
          token: videoToken,
        });
        setVideoClient(video);

        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing Stream clients:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    initClients();

    // Cleanup on unmount
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [user, isLoaded]);

  return { chatClient, videoClient, isLoading, error };
};
