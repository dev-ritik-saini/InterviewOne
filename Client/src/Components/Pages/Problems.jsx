import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { BsCodeSlash } from "react-icons/bs";
import { PROBLEMS } from "../../data/problems";
import { getDifficultyBadge } from "../../utils/getDifficultyBadge";
import Footer from "../Footer";
import Navbar from "../Navbar";

const Problem = () => {
  // Convert PROBLEMS object to array
  const problemsList = Object.values(PROBLEMS);

  // Calculating stats dynamically
  const totalProblems = problemsList.length;
  const easyCount = problemsList.filter(
    (p) => p.difficulty.toLowerCase() === "easy",
  ).length;
  const mediumCount = problemsList.filter(
    (p) => p.difficulty.toLowerCase() === "medium",
  ).length;
  const hardCount = problemsList.filter(
    (p) => p.difficulty.toLowerCase() === "hard",
  ).length;

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-base-content mb-3">
              Practice Problems
            </h1>
            <p className="text-base-content/60 text-lg">
              Sharpen your coding skills with these curated problems
            </p>
          </div>

          {/* Stats Section */}
          <div className="flex items-center gap-6 md:gap-8 bg-base-200/50 border border-base-300 rounded-xl px-6 py-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-base-content">
                {totalProblems}
              </p>
              <p className="text-sm text-base-content/60">Problems</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{easyCount}</p>
              <p className="text-sm text-base-content/60">Easy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{mediumCount}</p>
              <p className="text-sm text-base-content/60">Medium</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-error">{hardCount}</p>
              <p className="text-sm text-base-content/60">Hard</p>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {problemsList.map((problem) => (
            <div
              key={problem.id}
              className="bg-base-200/50 hover:bg-base-200 border border-base-300 rounded-xl p-6 transition-all duration-200 hover:border-primary/30 group"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Content */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className="p-3 bg-base-300/50 rounded-lg group-hover:bg-primary/10 transition-colors">
                    <BsCodeSlash className="h-6 w-6 text-primary" />
                  </div>

                  {/* Problem Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-lg font-semibold text-base-content group-hover:text-primary transition-colors">
                        {problem.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadge(
                          problem.difficulty,
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/50 mb-2">
                      {problem.category}
                    </p>
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {problem.description.text}
                    </p>
                  </div>
                </div>

                {/* Solve Button */}
                <Link
                  to={`/problem/${problem.id}`}
                  className="flex items-center gap-1 text-primary hover:text-primary-focus font-medium text-sm whitespace-nowrap group-hover:gap-2 transition-all"
                >
                  Solve
                  <FiChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no problems) */}
        {problemsList.length === 0 && (
          <div className="text-center py-20">
            <BsCodeSlash className="h-16 w-16 text-base-content/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No Problems Available
            </h3>
            <p className="text-base-content/60">
              Check back later for new coding challenges!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Problem;
