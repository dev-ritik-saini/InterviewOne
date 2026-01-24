import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  BsCodeSlash,
  BsPeople,
  BsChatDots,
  BsCameraVideo,
  BsXLg,
  BsGripHorizontal,
  BsGripVertical,
  BsChevronDown,
  BsCircleFill,
} from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi2";
import { LuLoader } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import CodeEditor from "../CodeEditor";
import { OutputPanel, EditorHeader } from "../CodeExecutor";
import VideoCall from "../VideoCall";
import ChatPanel from "../ChatPanel";
import { getDifficultyBadge } from "../../utils/getDifficultyBadge";
import {
  useSessionById,
  useJoinSession,
  useEndSession,
  useUpdateSessionProblem,
} from "../../Hooks/useSession";
import { useCollaborativeCode } from "../../Hooks/useCollaborativeCode";
import { PROBLEMS } from "../../data/problems";

const SessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  // Session data
  const {
    data: sessionData,
    isLoading,
    error,
    refetch,
  } = useSessionById(sessionId);
  const { mutate: joinSession } = useJoinSession(sessionId);
  const { mutate: endSession, isPending: isEnding } = useEndSession(sessionId);
  const { mutate: updateProblem, isPending: isUpdatingProblem } =
    useUpdateSessionProblem(sessionId);

  // UI state
  const [showChat, setShowChat] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProblemDropdownOpen, setIsProblemDropdownOpen] = useState(false);

  // Resizable panel states
  const [outputHeight, setOutputHeight] = useState(180);
  const [leftPanelFlex, setLeftPanelFlex] = useState(6);
  const [rightPanelFlex, setRightPanelFlex] = useState(4);
  const [descriptionHeight, setDescriptionHeight] = useState(180);

  // Refs for resize handling
  const mainContainerRef = useRef(null);
  const editorContainerRef = useRef(null);
  const isDraggingOutput = useRef(false);
  const isDraggingRightPanel = useRef(false);
  const isDraggingDescription = useRef(false);

  const session = sessionData?.session;

  // Get problem data from local problems based on session problem title
  const problemData = session
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  // Collaborative code execution hook (uses Stream for real-time sync)
  const {
    code,
    language,
    output,
    isRunning,
    isError,
    activeOutputTab,
    setCode,
    setLanguage,
    setActiveOutputTab,
    handleRunCode,
    isConnected,
    remoteUser,
  } = useCollaborativeCode(session?.callId, problemData);

  // Initialize code when problem data is available
  useEffect(() => {
    if (problemData?.starterCode?.[language] && !code) {
      setCode(problemData.starterCode[language]);
    }
  }, [problemData, language, setCode, code]);

  // Join session on mount if not host
  useEffect(() => {
    if (session && user) {
      const isHost = session.host?.clerkId === user.id;
      const isParticipant = session.participant?.clerkId === user.id;

      if (!isHost && !isParticipant && session.status === "active") {
        joinSession();
      }
    }
  }, [session, user, joinSession]);

  // Handle resize for output panel (vertical)
  const handleOutputResizeStart = useCallback((e) => {
    e.preventDefault();
    isDraggingOutput.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  // Handle resize for right panel (horizontal)
  const handleRightPanelResizeStart = useCallback((e) => {
    e.preventDefault();
    isDraggingRightPanel.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  // Handle resize for description panel (vertical)
  const handleDescriptionResizeStart = useCallback((e) => {
    e.preventDefault();
    isDraggingDescription.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  // Mouse move and mouse up handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Output panel resize
      if (isDraggingOutput.current && editorContainerRef.current) {
        const containerRect =
          editorContainerRef.current.getBoundingClientRect();
        const newHeight = containerRect.bottom - e.clientY;
        const minHeight = 80;
        const maxHeight = containerRect.height * 0.6;
        setOutputHeight(Math.max(minHeight, Math.min(maxHeight, newHeight)));
      }

      // Right panel resize (flex-based)
      if (isDraggingRightPanel.current && mainContainerRef.current) {
        const containerRect = mainContainerRef.current.getBoundingClientRect();
        const totalWidth = containerRect.width;
        const mouseX = e.clientX - containerRect.left;

        // Calculate flex ratios based on mouse position
        const leftRatio = mouseX / totalWidth;
        const rightRatio = 1 - leftRatio;

        // Constrain between 40-70% for left panel (so right is 30-60%)
        const minLeftRatio = 0.4;
        const maxLeftRatio = 0.7;
        const constrainedLeftRatio = Math.max(
          minLeftRatio,
          Math.min(maxLeftRatio, leftRatio),
        );
        const constrainedRightRatio = 1 - constrainedLeftRatio;

        // Scale to flex values (total 10)
        setLeftPanelFlex(constrainedLeftRatio * 10);
        setRightPanelFlex(constrainedRightRatio * 10);
      }

      // Description panel resize
      if (isDraggingDescription.current && editorContainerRef.current) {
        const containerRect =
          editorContainerRef.current.getBoundingClientRect();
        const newHeight = e.clientY - containerRect.top;
        const minHeight = 80;
        const maxHeight = containerRect.height * 0.4;
        setDescriptionHeight(
          Math.max(minHeight, Math.min(maxHeight, newHeight)),
        );
      }
    };

    const handleMouseUp = () => {
      isDraggingOutput.current = false;
      isDraggingRightPanel.current = false;
      isDraggingDescription.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // End session
  const handleEndSession = () => {
    endSession(undefined, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-base-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LuLoader className="h-10 w-10 text-primary animate-spin" />
          <p className="text-base-content/60">Loading session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !session) {
    return (
      <div className="h-screen bg-base-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 bg-error/20 rounded-full">
            <BsCodeSlash className="h-8 w-8 text-error" />
          </div>
          <p className="text-error font-medium">Session not found</p>
          <p className="text-base-content/60 text-sm">
            {error?.message || "The session you're looking for doesn't exist"}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary btn-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isHost = session.host?.clerkId === user?.id;
  const participantCount = 1 + (session.participant ? 1 : 0);

  // Handle problem change
  const handleProblemChange = (newProblem) => {
    updateProblem(
      { problem: newProblem.title, difficulty: newProblem.difficulty },
      {
        onSuccess: () => {
          refetch();
          setIsProblemDropdownOpen(false);
        },
      },
    );
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-base-200 border-b border-base-300 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          {/* Left: Problem Info */}
          <div className="flex items-center gap-4">
            {/* Problem Selector Dropdown (Host Only) */}
            {isHost && session.status === "active" ? (
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProblemDropdownOpen(!isProblemDropdownOpen)
                  }
                  disabled={isUpdatingProblem}
                  className="flex items-center gap-2 text-xl font-bold text-base-content hover:text-primary transition-colors"
                >
                  {isUpdatingProblem ? (
                    <LuLoader className="h-5 w-5 animate-spin" />
                  ) : null}
                  {session.problem}
                  <BsChevronDown
                    className={`h-4 w-4 transition-transform ${isProblemDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isProblemDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-base-200 border border-base-300 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                    {Object.values(PROBLEMS).map((problem) => (
                      <button
                        key={problem.id}
                        onClick={() => handleProblemChange(problem)}
                        disabled={problem.title === session.problem}
                        className={`w-full px-4 py-3 text-left hover:bg-base-300 transition-colors flex items-center justify-between ${
                          problem.title === session.problem
                            ? "bg-primary/10 text-primary"
                            : ""
                        }`}
                      >
                        <span className="font-medium">{problem.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getDifficultyBadge(
                            problem.difficulty,
                          )}`}
                        >
                          {problem.difficulty.charAt(0).toUpperCase() +
                            problem.difficulty.slice(1)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <h1 className="text-xl font-bold text-base-content">
                {session.problem}
              </h1>
            )}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyBadge(
                session.difficulty,
              )}`}
            >
              {session.difficulty.charAt(0).toUpperCase() +
                session.difficulty.slice(1)}
            </span>
            {problemData?.category && (
              <span className="text-sm text-base-content/60">
                {problemData.category}
              </span>
            )}
          </div>

          {/* Right: Session Info & Actions */}
          <div className="flex items-center gap-4">
            {/* Collaboration Status */}
            <div className="flex items-center gap-2">
              <BsCircleFill
                className={`h-2 w-2 ${isConnected ? "text-success" : "text-warning"}`}
              />
              <span className="text-xs text-base-content/60">
                {isConnected ? "Live Sync" : "Connecting..."}
              </span>
              {remoteUser && (
                <span className="text-xs text-primary">
                  • {remoteUser.name} editing
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <span>Host: {session.host?.name || session.host?.email}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FiUsers className="h-4 w-4" />
                {participantCount}/2 participants
              </span>
            </div>

            {isHost && session.status === "active" && (
              <button
                onClick={handleEndSession}
                disabled={isEnding}
                className="btn btn-error btn-sm gap-2"
              >
                {isEnding ? (
                  <LuLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <BsXLg className="h-4 w-4" />
                )}
                End Session
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - 6:4 Split */}
      <div
        ref={mainContainerRef}
        className="flex-1 flex overflow-hidden min-h-0"
      >
        {/* Left Panel (60%): Problem & Code Editor */}
        <div
          ref={editorContainerRef}
          className="flex flex-col overflow-hidden min-w-0"
          style={{ flex: leftPanelFlex }}
        >
          {/* Problem Description - Resizable */}
          <div
            className="border-b border-base-300 bg-base-200/50 overflow-y-auto shrink-0"
            style={{ height: descriptionHeight }}
          >
            <div className="p-4">
              <h2 className="font-semibold text-base-content mb-2 flex items-center gap-2">
                <HiOutlineSparkles className="h-5 w-5 text-primary" />
                Description
              </h2>
              {problemData ? (
                <div className="text-sm text-base-content/80">
                  <p>{problemData.description.text}</p>
                  {problemData.description.notes && (
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {problemData.description.notes.map((note, idx) => (
                        <li key={idx} className="text-base-content/60">
                          {note}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <p className="text-sm text-base-content/60">
                  Solve the {session.problem} problem together!
                </p>
              )}
            </div>
          </div>

          {/* Description Resize Handle */}
          <div
            onMouseDown={handleDescriptionResizeStart}
            className="h-2 bg-base-300 border-t border-b border-base-300 cursor-row-resize hover:bg-primary/30 transition-colors flex items-center justify-center group shrink-0"
          >
            <BsGripHorizontal className="h-3 w-3 text-base-content/30 group-hover:text-primary" />
          </div>

          {/* Code Editor Section */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Editor Header */}
            <EditorHeader
              selectedLanguage={language}
              onLanguageChange={setLanguage}
              onRunCode={handleRunCode}
              isRunning={isRunning}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              showLanguageIcon={true}
            />

            {/* Code Editor */}
            <div className="flex-1 min-h-0">
              <CodeEditor language={language} code={code} onChange={setCode} />
            </div>

            {/* Output Resize Handle */}
            <div
              onMouseDown={handleOutputResizeStart}
              className="h-2 bg-base-300 border-t border-b border-base-300 cursor-row-resize hover:bg-primary/30 transition-colors flex items-center justify-center group shrink-0"
            >
              <BsGripHorizontal className="h-3 w-3 text-base-content/30 group-hover:text-primary" />
            </div>

            {/* Output Section */}
            <OutputPanel
              output={output}
              isError={isError}
              activeTab={activeOutputTab}
              onTabChange={setActiveOutputTab}
              height={outputHeight}
              resizable={false}
              testcase={problemData?.examples?.[0]?.input}
              expectedOutput={problemData?.examples?.[0]?.output}
            />
          </div>
        </div>

        {/* Center Resize Handle */}
        <div
          onMouseDown={handleRightPanelResizeStart}
          className="w-2 bg-base-300 border-l border-r border-base-300 cursor-col-resize hover:bg-primary/30 transition-colors flex items-center justify-center group shrink-0"
        >
          <BsGripVertical className="h-3 w-3 text-base-content/30 group-hover:text-primary" />
        </div>

        {/* Right Panel (40%): Video & Chat */}
        <div
          className="flex flex-col bg-base-200/30 overflow-hidden min-w-0"
          style={{ flex: rightPanelFlex }}
        >
          {/* Video Call Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-base-300 shrink-0">
            <div className="flex items-center gap-2">
              <BsCameraVideo className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {participantCount} participant
                {participantCount > 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`btn btn-sm btn-ghost gap-2 ${showChat ? "btn-active" : ""}`}
            >
              <BsChatDots className="h-4 w-4" />
              Chat
            </button>
          </div>

          {/* Video Call Area */}
          <div
            className={`flex flex-col overflow-hidden ${showChat ? "flex-1" : "flex-1"}`}
          >
            {session.callId ? (
              <VideoCall callId={session.callId} />
            ) : (
              <div className="flex-1 bg-base-300/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <BsCameraVideo className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-base-content/60 text-sm">
                    No video call available
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Section (Toggled) */}
          {showChat && (
            <div className="h-72 border-t border-base-300 flex flex-col shrink-0">
              {session.callId ? (
                <ChatPanel channelId={session.callId} />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-base-content/40 text-sm">
                    Chat unavailable
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
