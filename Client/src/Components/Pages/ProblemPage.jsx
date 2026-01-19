import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BsPlay,
  BsChevronDown,
  BsTerminal,
  BsGripHorizontal,
} from "react-icons/bs";
import { FiCheck, FiX } from "react-icons/fi";
import { PROBLEMS } from "../../data/problems";
import { getDifficultyBadge } from "../../utils/getDifficultyBadge";
import CodeEditor from "../CodeEditor";
import Navbar from "../Navbar";
import { executeCode } from "../../lib/piston";

const ProblemPage = () => {
  const { problemId } = useParams();

  // Get problem data
  const problem = PROBLEMS[problemId];
  const problemsList = Object.values(PROBLEMS);

  // State for language selection and code
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState("testcase");
  const [outputHeight, setOutputHeight] = useState(180); // Default height in pixels
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  // Handle drag to resize output panel
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = containerRect.bottom - e.clientY;

      // Constrain between min (80px) and max (70% of container)
      const minHeight = 80;
      const maxHeight = containerRect.height * 0.7;
      setOutputHeight(Math.max(minHeight, Math.min(maxHeight, newHeight)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
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

  // Language options
  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
  ];

  // Set initial code when problem or language changes
  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[selectedLanguage] || "");
      setOutput("");
    }
  }, [problemId, selectedLanguage, problem]);

  // Handle problem not found
  if (!problem) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-base-content mb-4">
            Problem Not Found
          </h1>
          <Link to="/problems" className="btn btn-primary">
            Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  // Handle run code
  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput("No code to execute");
      setIsError(true);
      setActiveOutputTab("result");
      return;
    }

    setIsRunning(true);
    setOutput("");
    setIsError(false);
    setActiveOutputTab("result");

    try {
      const result = await executeCode(selectedLanguage, code);
      if (result.success) {
        setOutput(result.output);
        setIsError(false);
      } else {
        setOutput(result.error || result.output || "Execution failed");
        setIsError(true);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsError(true);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Problem Description (Scrollable) */}
        <div className="w-full lg:w-1/2 overflow-y-auto border-r border-base-300 p-6">
          {/* Problem Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-primary">
                {problem.title}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadge(
                  problem.difficulty,
                )}`}
              >
                {problem.difficulty}
              </span>
            </div>
            <p className="text-sm text-base-content/60">{problem.category}</p>
          </div>

          {/* Description */}
          <div className="mb-6 bg-base-200/50 border border-base-300 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-base-content mb-3">
              Description
            </h2>
            <p className="text-sm text-base-content/80 mb-4">
              {problem.description.text}
            </p>
            {problem.description.notes?.map((note, index) => (
              <p key={index} className="text-sm text-base-content/70 mb-2">
                {note}
              </p>
            ))}
          </div>

          {/* Examples */}
          <div className="mb-6 bg-base-200/50 border border-base-300 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-base-content mb-3">
              Examples
            </h2>
            {problem.examples.map((example, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <p className="text-sm font-medium text-base-content mb-2">
                  Example {index + 1}
                </p>{" "}
                <div className="font-mono text-sm">
                  <p className="text-base-content/80">
                    <span className="text-primary">Input:</span> {example.input}
                  </p>
                  <p className="text-base-content/80">
                    <span className="text-warning">Output:</span>{" "}
                    {example.output}
                  </p>
                  {example.explanation && (
                    <p className="text-base-content/60 text-xs mt-1">
                      Explanation: {example.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="bg-base-200/50 border border-base-300 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-base-content mb-3">
              Constraints
            </h2>
            <ul className="list-disc list-inside text-sm text-base-content/70 space-y-1">
              {problem.constraints.map((constraint, index) => (
                <li key={index} className="font-mono">
                  {constraint}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Panel - Code Editor (Fixed in viewport) */}
        <div
          ref={containerRef}
          className="w-full lg:w-1/2 flex flex-col overflow-hidden"
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200/30 shrink-0">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-base-200 border border-base-300 rounded-lg text-sm hover:border-primary/30 transition-colors"
              >
                <img
                  src={`/${selectedLanguage === "javascript" ? "js" : selectedLanguage}.png`}
                  alt={selectedLanguage}
                  className="h-4 w-4"
                />
                <span className="capitalize">
                  {languages.find((l) => l.id === selectedLanguage)?.name}
                </span>
                <BsChevronDown
                  className={`h-3 w-3 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-base-200 border border-base-300 rounded-lg shadow-lg z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setSelectedLanguage(lang.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-300 transition-colors ${
                        lang.id === selectedLanguage ? "bg-base-300" : ""
                      }`}
                    >
                      <img
                        src={`/${lang.id === "javascript" ? "js" : lang.id}.png`}
                        alt={lang.name}
                        className="h-4 w-4"
                      />
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="btn btn-primary btn-sm gap-2"
            >
              {isRunning ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Running...
                </>
              ) : (
                <>
                  <BsPlay className="h-4 w-4" />
                  Run Code
                </>
              )}
            </button>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 bg-base-200/20 overflow-hidden">
            <CodeEditor
              language={selectedLanguage}
              code={code}
              onChange={setCode}
            />
          </div>

          {/* Resizable Divider */}
          <div
            onMouseDown={handleMouseDown}
            className="h-2 bg-base-300 border-t border-b border-base-300 cursor-row-resize hover:bg-primary/30 transition-colors flex items-center justify-center group shrink-0"
          >
            <BsGripHorizontal className="h-3 w-3 text-base-content/30 group-hover:text-primary" />
          </div>

          {/* Output Section - LeetCode Style */}
          <div
            className="border-t border-base-300 shrink-0 bg-base-200/30 flex flex-col"
            style={{ height: outputHeight }}
          >
            {/* Tabs */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-base-300 shrink-0">
              <button
                onClick={() => setActiveOutputTab("testcase")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeOutputTab === "testcase"
                    ? "bg-base-300 text-base-content"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"
                }`}
              >
                <BsTerminal className="h-4 w-4" />
                Testcase
              </button>
              <button
                onClick={() => setActiveOutputTab("result")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeOutputTab === "result"
                    ? "bg-base-300 text-base-content"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"
                }`}
              >
                {output ? (
                  isError ? (
                    <FiX className="h-4 w-4 text-error" />
                  ) : (
                    <FiCheck className="h-4 w-4 text-success" />
                  )
                ) : (
                  <BsTerminal className="h-4 w-4 text-base-content/40" />
                )}
                Test Result
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeOutputTab === "testcase" ? (
                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-xs text-base-content/50 mb-1">Input:</p>
                    <div className="bg-base-300/50 rounded-md px-3 py-2">
                      <code className="font-mono text-sm text-base-content">
                        {problem.examples[0]?.input || "No input"}
                      </code>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 mb-1">
                      Expected Output:
                    </p>
                    <div className="bg-base-300/50 rounded-md px-3 py-2">
                      <code className="font-mono text-sm text-base-content">
                        {problem.examples[0]?.output || "No output"}
                      </code>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {output ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        {isError ? (
                          <>
                            <FiX className="h-5 w-5 text-error" />
                            <span className="text-error font-semibold">
                              Error
                            </span>
                          </>
                        ) : (
                          <>
                            <FiCheck className="h-5 w-5 text-success" />
                            <span className="text-success font-semibold">
                              Accepted
                            </span>
                          </>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-base-content/50 mb-1">
                          {isError ? "Error:" : "Output:"}
                        </p>
                        <div
                          className={`rounded-md px-3 py-2 ${isError ? "bg-error/10 border border-error/30" : "bg-base-300/50"}`}
                        >
                          <code
                            className={`font-mono text-sm whitespace-pre-wrap ${isError ? "text-error" : "text-base-content"}`}
                          >
                            {output}
                          </code>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-base-content/50">
                      <BsTerminal className="h-8 w-8 mb-2" />
                      <p className="text-sm">Run your code to see results</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemPage;
