import React from "react";
import { BsPlay, BsChevronDown } from "react-icons/bs";

const LANGUAGES = [
  { id: "javascript", name: "JavaScript", icon: "js" },
  { id: "python", name: "Python", icon: "python" },
  { id: "java", name: "Java", icon: "java" },
];

const EditorHeader = ({
  selectedLanguage,
  onLanguageChange,
  onRunCode,
  isRunning,
  isDropdownOpen,
  setIsDropdownOpen,
  showLanguageIcon = true,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-200/30 shrink-0">
      {/* Language Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-base-200 border border-base-300 rounded-lg text-sm hover:border-primary/30 transition-colors"
        >
          {showLanguageIcon && (
            <img
              src={`/${selectedLanguage === "javascript" ? "js" : selectedLanguage}.png`}
              alt={selectedLanguage}
              className="h-4 w-4"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <span className="capitalize">
            {LANGUAGES.find((l) => l.id === selectedLanguage)?.name ||
              selectedLanguage}
          </span>
          <BsChevronDown
            className={`h-3 w-3 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-base-200 border border-base-300 rounded-lg shadow-lg z-10">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  onLanguageChange(lang.id);
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-base-300 transition-colors ${
                  lang.id === selectedLanguage ? "bg-base-300" : ""
                }`}
              >
                {showLanguageIcon && (
                  <img
                    src={`/${lang.icon === "javascript" ? "js" : lang.icon}.png`}
                    alt={lang.name}
                    className="h-4 w-4"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Run Button */}
      <button
        onClick={onRunCode}
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
  );
};

export { LANGUAGES };
export default EditorHeader;
