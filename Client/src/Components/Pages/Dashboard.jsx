import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  BsCodeSlash,
  BsPlusLg,
  BsPeople,
  BsArrowRight,
  BsClockHistory,
  BsCheckCircleFill,
  BsPlayCircleFill,
  BsXLg,
} from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi2";
import { FiActivity, FiUsers } from "react-icons/fi";
import { LuLoader } from "react-icons/lu";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { getDifficultyBadge } from "../../utils/getDifficultyBadge";
import {
  useActiveSessions,
  useMyRecentSessions,
  useCreateSession,
} from "../../Hooks/useSession";
import { PROBLEMS } from "../../data/problems";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState("");
  const [formError, setFormError] = useState("");

  // Create session mutation
  const { mutate: createNewSession, isPending: isCreating } =
    useCreateSession();

  // Fetch active sessions
  const {
    data: activeSessionsData,
    isLoading: isLoadingActive,
    error: activeError,
  } = useActiveSessions();

  // Fetch user's recent/past sessions
  const {
    data: recentSessionsData,
    isLoading: isLoadingRecent,
    error: recentError,
  } = useMyRecentSessions();

  // Extract data from API responses
  const liveSessions = activeSessionsData?.sessions || [];
  const pastSessions = recentSessionsData?.sessions || [];

  // Calculate stats
  const stats = {
    activeSessions: liveSessions.length,
    totalSessions: pastSessions.length,
  };

  // Convert problems object to array for dropdown
  const problemsList = Object.values(PROBLEMS);

  // Get selected problem details
  const selectedProblemData = selectedProblem
    ? PROBLEMS[selectedProblem]
    : null;

  // Format time ago helper
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  // Format completed date helper
  const formatCompletedDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle join session
  const handleJoinSession = (sessionId) => {
    navigate(`/session/${sessionId}`);
  };

  // Open create room modal
  const openCreateModal = () => {
    setSelectedProblem("");
    setFormError("");
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProblem("");
    setFormError("");
  };

  // Handle create room
  const handleCreateRoom = () => {
    // Validation
    if (!selectedProblem) {
      setFormError("Please select a problem");
      return;
    }

    setFormError("");

    // Get the problem data to send to API
    const problemData = PROBLEMS[selectedProblem];

    createNewSession(
      {
        problem: problemData.title,
        difficulty: problemData.difficulty,
      },
      {
        onSuccess: (data) => {
          closeModal();
          // Navigate to the newly created session
          if (data?.session?._id) {
            navigate(`/session/${data.session._id}`);
          }
        },
        onError: (error) => {
          setFormError(
            error.response?.data?.message ||
              "Failed to create session. Please try again.",
          );
        },
      },
    );
  };

  // Loading state
  if (isLoadingActive || isLoadingRecent) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LuLoader className="h-10 w-10 text-primary animate-spin" />
            <p className="text-base-content/60">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (activeError || recentError) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-error/20 rounded-full">
              <BsCodeSlash className="h-8 w-8 text-error" />
            </div>
            <p className="text-error font-medium">
              Failed to load dashboard data
            </p>
            <p className="text-base-content/60 text-sm">
              {activeError?.message ||
                recentError?.message ||
                "Please try again later"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-sm"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <HiOutlineSparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-base-content">
                Welcome back, {user?.firstName || "User"}!
              </h1>
              <p className="text-base-content/60 mt-1">
                Ready to level up your coding skills?
              </p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="btn btn-primary gap-2 px-6 self-start md:self-auto"
          >
            <BsPlusLg className="h-4 w-4" />
            Create Session
            <BsArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Stats and Live Sessions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Stats Cards */}
          <div className="space-y-6">
            {/* Active Sessions Card */}
            <div className="bg-base-200/50 border border-base-300 rounded-2xl p-6 hover:border-primary/30 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-base-300/50 rounded-xl">
                  <FiActivity className="h-6 w-6 text-primary" />
                </div>
                <span className="px-3 py-1 bg-success/20 text-success text-xs font-semibold rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold text-base-content">
                  {stats.activeSessions}
                </p>
                <p className="text-base-content/60 text-sm mt-1">
                  Active Sessions
                </p>
              </div>
            </div>

            {/* Total Sessions Card */}
            <div className="bg-base-200/50 border border-base-300 rounded-2xl p-6 hover:border-primary/30 transition-all duration-200">
              <div className="p-3 bg-base-300/50 rounded-xl w-fit">
                <FiUsers className="h-6 w-6 text-primary" />
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold text-base-content">
                  {stats.totalSessions}
                </p>
                <p className="text-base-content/60 text-sm mt-1">
                  Total Sessions
                </p>
              </div>
            </div>
          </div>

          {/* Live Sessions Section */}
          <div className="lg:col-span-2 bg-base-200/50 border border-base-300 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BsPlayCircleFill className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-base-content">
                  Live Sessions
                </h2>
              </div>
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                {liveSessions.length} active
              </span>
            </div>

            {liveSessions.length > 0 ? (
              <div className="space-y-4">
                {liveSessions.map((session) => (
                  <div
                    key={session._id}
                    className="bg-base-300/30 border border-base-300 rounded-xl p-4 hover:border-primary/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-xl">
                          <BsCodeSlash className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base-content">
                              {session.problem?.title || "Coding Session"}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadge(
                                session.problem?.difficulty || "Medium",
                              )}`}
                            >
                              {session.problem?.difficulty || "Medium"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-base-content/60">
                            <span className="flex items-center gap-1">
                              👤{" "}
                              {session.host?.name ||
                                session.host?.email ||
                                "Host"}
                            </span>
                            <span className="flex items-center gap-1">
                              <BsPeople className="h-4 w-4" />
                              {session.participants?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinSession(session._id)}
                        className="btn btn-primary btn-sm gap-2"
                      >
                        Join
                        <BsArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-base-300/50 rounded-full mb-4">
                  <BsCodeSlash className="h-8 w-8 text-base-content/40" />
                </div>
                <p className="text-base-content/60 mb-4">
                  No live sessions at the moment
                </p>
                <button
                  onClick={openCreateModal}
                  className="btn btn-primary btn-sm"
                >
                  Start a Session
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Past Sessions Section */}
        <div className="bg-base-200/50 border border-base-300 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BsClockHistory className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-base-content">
              Your Past Sessions
            </h2>
          </div>

          {pastSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastSessions.map((session) => (
                <div
                  key={session._id}
                  onClick={() => handleJoinSession(session._id)}
                  className="bg-base-300/30 border border-base-300 rounded-xl p-5 hover:border-primary/30 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2.5 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                      <BsCodeSlash className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base-content truncate">
                          {session.problem?.title || "Coding Session"}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadge(
                            session.problem?.difficulty || "Medium",
                          )}`}
                        >
                          {session.problem?.difficulty || "Medium"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-base-content/60">
                    <div className="flex items-center gap-2">
                      <BsClockHistory className="h-4 w-4" />
                      <span>{formatTimeAgo(session.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BsPeople className="h-4 w-4" />
                      <span>
                        {session.participants?.length || 0} participant
                        {(session.participants?.length || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {session.status === "completed" && (
                    <div className="mt-4 pt-4 border-t border-base-300 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-success text-sm font-medium">
                        <BsCheckCircleFill className="h-4 w-4" />
                        COMPLETED
                      </span>
                      <span className="text-xs text-base-content/50">
                        {formatCompletedDate(
                          session.endedAt || session.updatedAt,
                        )}
                      </span>
                    </div>
                  )}

                  {session.status === "active" && (
                    <div className="mt-4 pt-4 border-t border-base-300 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-warning text-sm font-medium">
                        <BsPlayCircleFill className="h-4 w-4" />
                        IN PROGRESS
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-base-300/50 rounded-full mb-4">
                <BsClockHistory className="h-8 w-8 text-base-content/40" />
              </div>
              <p className="text-base-content/60 mb-4">
                No past sessions yet. Start your first coding session!
              </p>
              <button
                onClick={openCreateModal}
                className="btn btn-primary btn-sm"
              >
                Browse Problems
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Create Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative bg-base-200 border border-base-300 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1 hover:bg-base-300 rounded-lg transition-colors"
            >
              <BsXLg className="h-5 w-5 text-base-content/60" />
            </button>

            {/* Modal Header */}
            <h2 className="text-xl font-bold text-base-content mb-6">
              Create New Session
            </h2>

            {/* Problem Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-base-content mb-2">
                Select Problem <span className="text-error">*</span>
              </label>
              <select
                value={selectedProblem}
                onChange={(e) => {
                  setSelectedProblem(e.target.value);
                  setFormError("");
                }}
                className={`select select-bordered w-full bg-base-300 ${
                  formError && !selectedProblem ? "select-error" : ""
                }`}
              >
                <option value="">Choose a problem...</option>
                {problemsList.map((problem) => (
                  <option key={problem.id} value={problem.id}>
                    {problem.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="mb-4 p-3 bg-error/20 border border-error/30 rounded-lg">
                <p className="text-error text-sm">{formError}</p>
              </div>
            )}

            {/* Room Summary */}
            {selectedProblemData && (
              <div className="mb-6 p-4 bg-primary rounded-xl">
                <p className="text-primary-content font-semibold mb-2">
                  Room Summary:
                </p>
                <div className="flex items-center gap-2 text-primary-content/90">
                  <BsCodeSlash className="h-4 w-4" />
                  <span>Problem: {selectedProblemData.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadge(
                      selectedProblemData.difficulty,
                    )}`}
                  >
                    {selectedProblemData.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-primary-content/90 mt-1">
                  <BsPeople className="h-4 w-4" />
                  <span>Max Participants: 2 (1-on-1 session)</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="btn btn-ghost"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={isCreating || !selectedProblem}
                className="btn btn-primary gap-2"
              >
                {isCreating ? (
                  <>
                    <LuLoader className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <BsPlusLg className="h-4 w-4" />
                    Create Room
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
