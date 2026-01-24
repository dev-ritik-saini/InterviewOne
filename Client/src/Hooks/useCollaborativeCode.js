import { useState, useEffect, useCallback, useRef } from "react";
import { useChatContext } from "stream-chat-react";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";
import debounce from "../utils/debounce";

/**
 * Custom hook for collaborative code editing using Stream custom events
 * @param {string} channelId - The Stream channel ID (same as session callId)
 * @param {Object} problemData - Problem data with starter code
 * @returns {Object} Collaborative code state and handlers
 */
export const useCollaborativeCode = (channelId, problemData) => {
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteUser, setRemoteUser] = useState(null);
  const isLocalChange = useRef(false);

  // Code state
  const [code, setCodeState] = useState("");
  const [language, setLanguageState] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState("testcase");

  // Initialize channel for code sync
  useEffect(() => {
    if (!client || !channelId) return;

    const initChannel = async () => {
      try {
        const ch = client.channel("messaging", channelId);
        await ch.watch();
        setChannel(ch);
        setIsConnected(true);
      } catch (err) {
        console.error("Error initializing code sync channel:", err);
        setIsConnected(false);
      }
    };

    initChannel();

    return () => {
      setChannel(null);
      setIsConnected(false);
    };
  }, [client, channelId]);

  // Create debounced send function
  const sendCodeUpdateRef = useRef(null);
  
  useEffect(() => {
    sendCodeUpdateRef.current = debounce(async (newCode, newLanguage) => {
      if (!channel || !isConnected || !client) return;

      try {
        await channel.sendEvent({
          type: "code_update",
          code: newCode,
          language: newLanguage,
          userId: client.userID,
          userName: client.user?.name || "User",
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error("Error sending code update:", err);
      }
    }, 300);

    return () => {
      if (sendCodeUpdateRef.current?.cancel) {
        sendCodeUpdateRef.current.cancel();
      }
    };
  }, [channel, client, isConnected]);

  // Send output update to other participants
  const sendOutputUpdate = useCallback(
    async (outputText, hasError) => {
      if (!channel || !isConnected || !client) return;

      try {
        await channel.sendEvent({
          type: "output_update",
          output: outputText,
          isError: hasError,
          userId: client.userID,
          userName: client.user?.name || "User",
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error("Error sending output update:", err);
      }
    },
    [channel, client, isConnected]
  );

  // Send language change to other participants
  const sendLanguageChange = useCallback(
    async (newLanguage) => {
      if (!channel || !isConnected || !client) return;

      try {
        await channel.sendEvent({
          type: "language_change",
          language: newLanguage,
          userId: client.userID,
          userName: client.user?.name || "User",
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error("Error sending language change:", err);
      }
    },
    [channel, client, isConnected]
  );

  // Listen for code updates from other participants
  useEffect(() => {
    if (!channel || !client) return;

    const handleCodeUpdate = (event) => {
      // Ignore our own events
      if (event.user?.id === client.userID) return;

      isLocalChange.current = true;
      setCodeState(event.code);
      setRemoteUser({
        name: event.userName,
        id: event.userId,
        lastUpdate: event.timestamp,
      });

      // Clear remote user indicator after 2 seconds
      setTimeout(() => {
        setRemoteUser(null);
      }, 2000);

      // Reset flag after a short delay
      setTimeout(() => {
        isLocalChange.current = false;
      }, 100);
    };

    const handleOutputUpdate = (event) => {
      // Ignore our own events
      if (event.user?.id === client.userID) return;

      setOutput(event.output);
      setIsError(event.isError);
      setActiveOutputTab("result");
    };

    const handleLanguageChange = (event) => {
      // Ignore our own events
      if (event.user?.id === client.userID) return;

      isLocalChange.current = true;
      setLanguageState(event.language);

      // Reset flag after a short delay
      setTimeout(() => {
        isLocalChange.current = false;
      }, 100);
    };

    // Subscribe to custom events
    channel.on("code_update", handleCodeUpdate);
    channel.on("output_update", handleOutputUpdate);
    channel.on("language_change", handleLanguageChange);

    return () => {
      channel.off("code_update", handleCodeUpdate);
      channel.off("output_update", handleOutputUpdate);
      channel.off("language_change", handleLanguageChange);
    };
  }, [channel, client]);

  // Wrapper for setCode that broadcasts changes
  const setCode = useCallback(
    (newCode) => {
      setCodeState(newCode);

      // Only send if it's a local change (not from remote)
      if (!isLocalChange.current && sendCodeUpdateRef.current) {
        sendCodeUpdateRef.current(newCode, language);
      }
    },
    [language]
  );

  // Wrapper for setLanguage that broadcasts changes
  const setLanguage = useCallback(
    (newLanguage) => {
      setLanguageState(newLanguage);

      // Only send if it's a local change
      if (!isLocalChange.current) {
        sendLanguageChange(newLanguage);
        
        // Update code to new language's starter code
        if (problemData?.starterCode?.[newLanguage]) {
          const newCode = problemData.starterCode[newLanguage];
          setCodeState(newCode);
          if (sendCodeUpdateRef.current) {
            sendCodeUpdateRef.current(newCode, newLanguage);
          }
        }
      }
    },
    [sendLanguageChange, problemData]
  );

  // Run code and broadcast output
  const handleRunCode = useCallback(async () => {
    if (!code.trim()) {
      setOutput("No code to execute");
      setIsError(true);
      setActiveOutputTab("result");
      toast.error("Please write some code first");
      return;
    }

    setIsRunning(true);
    setOutput("");
    setIsError(false);
    setActiveOutputTab("result");

    try {
      const result = await executeCode(language, code);
      let outputText = "";
      let hasError = false;

      if (result.success) {
        outputText = result.output || "Code executed successfully (no output)";
        hasError = false;
        toast.success("Code executed successfully!");
      } else {
        outputText = result.error || result.output || "Execution failed";
        hasError = true;
        toast.error("Code execution failed");
      }

      setOutput(outputText);
      setIsError(hasError);

      // Send output to other participants
      sendOutputUpdate(outputText, hasError);

    } catch (error) {
      const errorMsg = `Error: ${error.message}`;
      setOutput(errorMsg);
      setIsError(true);
      toast.error(`Error: ${error.message}`);

      // Send error to other participants
      sendOutputUpdate(errorMsg, true);
    } finally {
      setIsRunning(false);
    }
  }, [code, language, sendOutputUpdate]);

  // Reset output
  const resetOutput = useCallback(() => {
    setOutput("");
    setIsError(false);
    setActiveOutputTab("testcase");
  }, []);

  return {
    // State
    code,
    language,
    output,
    isRunning,
    isError,
    activeOutputTab,

    // Setters
    setCode,
    setLanguage,
    setActiveOutputTab,

    // Handlers
    handleRunCode,
    resetOutput,

    // Collaboration state
    isConnected,
    remoteUser,
    channel,
  };
};
