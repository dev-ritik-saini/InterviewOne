import { useState, useEffect, useRef } from "react";
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

  // Use refs to track clients for cleanup (avoids stale closure issue)
  const chatClientRef = useRef(null);
  const videoClientRef = useRef(null);

  useEffect(() => {
    if (!isLoaded || !user) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const initClients = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get tokens from backend
        const { token, videoToken, userId, userName, userImage } =
          await sessionApi.getStreamToken();

        if (!isMounted) return;

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
        
        if (!isMounted) {
          chat.disconnectUser();
          return;
        }
        
        chatClientRef.current = chat;
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
        
        if (!isMounted) {
          chat.disconnectUser();
          video.disconnectUser();
          return;
        }
        
        videoClientRef.current = video;
        setVideoClient(video);

        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing Stream clients:", err);
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };

    initClients();

    // Cleanup on unmount - use refs to get current client instances
    return () => {
      isMounted = false;
      if (chatClientRef.current) {
        chatClientRef.current.disconnectUser();
        chatClientRef.current = null;
      }
      if (videoClientRef.current) {
        videoClientRef.current.disconnectUser();
        videoClientRef.current = null;
      }
    };
  }, [user, isLoaded]);

  return { chatClient, videoClient, isLoading, error };
};
