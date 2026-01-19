const PISTON_API = "https://emkc.org/api/v2/piston"

const LANGUAGES_VERSION = {
    javascript: { language: "javascript", version: "18.15.0" },
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" },
}


/**
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output:string, error?: string}>}
 */

export async function executeCode(language, code) {
    try {
        const languageConfig = LANGUAGES_VERSION[language]

        if (!languageConfig) {
            return {
                success: false,
                error: `Unsupported language ${language}`
            }
        }


        const response = await fetch(`${PISTON_API}/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: languageConfig.language,
                version: languageConfig.version,
                files: [{
                    name: `main.${getFileExtension(language)}`,
                    content: code
                }]
            })
        })

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP error ${response.status}`
            }
        }

        const data = await response.json()

        const output = data.run.output || ""
        const stderr = data.run.stderr || ""

        if (stderr) {
            return {
                success: false,
                output: output,
                error: stderr
            }
        }

        return {
            success: true,
            output: output || "No output"
        }

    } catch (error) {
        return {
            success: false,
            error: `Failed to execute the code: ${error.message}`
        }
    }
}

function getFileExtension(language) {
    const extensions = {
        javascript: "js",
        python: "py",
        java: "java",
    };
    return extensions[language] || "txt";
}