import React, { useEffect, useState } from "react";
import {
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
  useChatContext,
} from "stream-chat-react";
import { LuLoader } from "react-icons/lu";
import { BsChatDots } from "react-icons/bs";

const ChatPanel = ({ channelId }) => {
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!client || !channelId) return;

    const initChannel = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const ch = client.channel("messaging", channelId);
        await ch.watch();
        setChannel(ch);
        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing chat channel:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    initChannel();

    return () => {
      if (channel) {
        channel.stopWatching();
      }
    };
  }, [client, channelId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <LuLoader className="h-6 w-6 text-primary animate-spin mx-auto mb-2" />
          <p className="text-base-content/60 text-xs">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <BsChatDots className="h-6 w-6 text-error mx-auto mb-2" />
          <p className="text-error text-xs font-medium">Failed to load chat</p>
          <p className="text-base-content/40 text-xs mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-base-content/40 text-sm">Chat unavailable</p>
      </div>
    );
  }

  return (
    <Channel channel={channel}>
      <Window>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden">
            <MessageList />
          </div>
          <div className="border-t border-base-300">
            <MessageInput placeholder="Type a message..." />
          </div>
        </div>
      </Window>
    </Channel>
  );
};

export default ChatPanel;
