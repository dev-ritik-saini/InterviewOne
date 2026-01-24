import React from "react";
import { BsTerminal, BsGripHorizontal } from "react-icons/bs";
import { FiCheck, FiX } from "react-icons/fi";

const OutputPanel = ({
  output,
  isError,
  activeTab,
  onTabChange,
  height,
  onResizeStart,
  testcase,
  expectedOutput,
  resizable = true,
}) => {
  return (
    <div
      className="border-t border-base-300 shrink-0 bg-base-200/30 flex flex-col"
      style={{ height: height || 180 }}
    >
      {/* Resizable Divider */}
      {resizable && onResizeStart && (
        <div
          onMouseDown={onResizeStart}
          className="h-2 bg-base-300 border-t border-b border-base-300 cursor-row-resize hover:bg-primary/30 transition-colors flex items-center justify-center group shrink-0"
        >
          <BsGripHorizontal className="h-3 w-3 text-base-content/30 group-hover:text-primary" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-base-300 shrink-0">
        <button
          onClick={() => onTabChange("testcase")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === "testcase"
              ? "bg-base-300 text-base-content"
              : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"
          }`}
        >
          <BsTerminal className="h-4 w-4" />
          Testcase
        </button>
        <button
          onClick={() => onTabChange("result")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === "result"
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
        {activeTab === "testcase" ? (
          <div className="p-4">
            <div className="mb-3">
              <p className="text-xs text-base-content/50 mb-1">Input:</p>
              <div className="bg-base-300/50 rounded-md px-3 py-2">
                <code className="font-mono text-sm text-base-content">
                  {testcase || "No input"}
                </code>
              </div>
            </div>
            <div>
              <p className="text-xs text-base-content/50 mb-1">
                Expected Output:
              </p>
              <div className="bg-base-300/50 rounded-md px-3 py-2">
                <code className="font-mono text-sm text-base-content">
                  {expectedOutput || "No output"}
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
                      <span className="text-error font-semibold">Error</span>
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
                    className={`rounded-md px-3 py-2 ${
                      isError
                        ? "bg-error/10 border border-error/30"
                        : "bg-base-300/50"
                    }`}
                  >
                    <code
                      className={`font-mono text-sm whitespace-pre-wrap ${
                        isError ? "text-error" : "text-base-content"
                      }`}
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
  );
};

export default OutputPanel;
