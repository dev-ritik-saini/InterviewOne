import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { BsGripHorizontal } from "react-icons/bs";
import { PROBLEMS } from "../../data/problems";
import { getDifficultyBadge } from "../../utils/getDifficultyBadge";
import CodeEditor from "../CodeEditor";
import { OutputPanel, EditorHeader } from "../CodeExecutor";
import Navbar from "../Navbar";
import { useCodeExecution } from "../../Hooks/useCodeExecution";

const ProblemPage = () => {
  const { problemId } = useParams();

  // Get problem data
  const problem = PROBLEMS[problemId];
  const problemsList = Object.values(PROBLEMS);

  // Code execution hook
  const {
    code,
    language: selectedLanguage,
    output,
    isRunning,
    isError,
    activeOutputTab,
    setCode,
    setLanguage: setSelectedLanguage,
    setActiveOutputTab,
    handleRunCode,
  } = useCodeExecution();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // Set initial code when problem or language changes
  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[selectedLanguage] || "");
    }
  }, [problemId, selectedLanguage, problem, setCode]);

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
          <EditorHeader
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            onRunCode={handleRunCode}
            isRunning={isRunning}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            showLanguageIcon={true}
          />

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

          {/* Output Section */}
          <OutputPanel
            output={output}
            isError={isError}
            activeTab={activeOutputTab}
            onTabChange={setActiveOutputTab}
            height={outputHeight}
            resizable={false}
            testcase={problem.examples[0]?.input}
            expectedOutput={problem.examples[0]?.output}
          />
        </div>
      </main>
    </div>
  );
};

export default ProblemPage;
