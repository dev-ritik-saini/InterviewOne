import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, code, onChange }) => {
  // Map language to Monaco language identifier
  const getMonacoLanguage = (lang) => {
    const languageMap = {
      javascript: "javascript",
      python: "python",
      java: "java",
    };
    return languageMap[lang] || "javascript";
  };

  // Editor options
  const editorOptions = {
    fontSize: 14,
    fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: "on",
    lineNumbers: "on",
    roundedSelection: true,
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    smoothScrolling: true,
    padding: { top: 16, bottom: 16 },
    folding: true,
    bracketPairColorization: { enabled: true },
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    formatOnPaste: true,
    formatOnType: true,
  };

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    // Define custom dark theme
    monaco.editor.defineTheme("interviewone-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        { token: "keyword", foreground: "569CD6" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "function", foreground: "DCDCAA" },
        { token: "variable", foreground: "9CDCFE" },
        { token: "type", foreground: "4EC9B0" },
      ],
      colors: {
        "editor.background": "#1D232A",
        "editor.foreground": "#D4D4D4",
        "editor.lineHighlightBackground": "#2A323C",
        "editor.selectionBackground": "#264F78",
        "editorCursor.foreground": "#00D26A",
        "editorLineNumber.foreground": "#6B7280",
        "editorLineNumber.activeForeground": "#00D26A",
        "editor.inactiveSelectionBackground": "#3A3D41",
        "editorIndentGuide.background": "#404040",
        "editorIndentGuide.activeBackground": "#707070",
      },
    });
    monaco.editor.setTheme("interviewone-dark");

    // Focus editor
    editor.focus();
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-base-300">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        options={editorOptions}
        loading={
          <div className="flex items-center justify-center h-full bg-base-300/50">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        }
      />
    </div>
  );
};

export default CodeEditor;
