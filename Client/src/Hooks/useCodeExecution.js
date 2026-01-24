import { useState, useCallback } from "react";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";

/**
 * Custom hook for code execution logic
 * @param {Object} options - Configuration options
 * @param {string} options.initialCode - Initial code value
 * @param {string} options.initialLanguage - Initial language (default: 'javascript')
 * @returns {Object} Code execution state and handlers
 */
export const useCodeExecution = (options = {}) => {
    const { initialCode = "", initialLanguage = "javascript" } = options;

    const [code, setCode] = useState(initialCode);
    const [language, setLanguage] = useState(initialLanguage);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isError, setIsError] = useState(false);
    const [activeOutputTab, setActiveOutputTab] = useState("testcase");

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
            if (result.success) {
                setOutput(result.output || "Code executed successfully (no output)");
                setIsError(false);
                toast.success("Code executed successfully!");
            } else {
                setOutput(result.error || result.output || "Execution failed");
                setIsError(true);
                toast.error("Code execution failed");
            }
        } catch (error) {
            setOutput(`Error: ${error.message}`);
            setIsError(true);
            toast.error(`Error: ${error.message}`);
        } finally {
            setIsRunning(false);
        }
    }, [code, language]);

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
        setOutput,
        setActiveOutputTab,

        // Handlers
        handleRunCode,
        resetOutput,
    };
};

export default useCodeExecution;
