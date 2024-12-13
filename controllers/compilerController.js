import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const onCompileCodeHandler = async (req, res) => {
    const { language, code } = req.body;

    if (!language || !code) {
        return res.status(400).json({ error: "Language and code are required" });
    }

    const tempDir = path.join(__dirname, "temp");
    await fs.mkdir(tempDir, { recursive: true }); // Ensure the temp directory exists
    const extension = getFileExtension(language);
    const filename = `code.${extension}`;
    const filePath = path.join(tempDir, filename);

    try {
        await fs.writeFile(filePath, code); // Write the code to the temp file

        const output = await executeCode(language, filePath);
        await fs.rm(filePath); // Remove the temp file after execution

        res.json({ output });
    } catch (error) {
        // Remove the temp file in case of an error
        await fs.rm(filePath, { force: true }).catch(() => { });
        res.status(500).json({ error: error.message });
    }
};

function getFileExtension(language) {
    const mapping = {
        Python: "py",
        Java: "java",
        Javascript: "js",
        C: "c",
        Cpp: "cpp",
    };
    return mapping[language] || null;
}

function executeCode(language, filePath) {
    return new Promise((resolve, reject) => {
        const commands = {
            Python: `python3 ${filePath}`,
            Java: `javac ${filePath} && java ${filePath.split(".")[0]}`,
            Javascript: `node ${filePath}`,
            C: `gcc ${filePath} -o ${filePath}.out && ${filePath}.out`,
            Cpp: `g++ ${filePath} -o ${filePath}.out && ${filePath}.out`,
        };

        const command = commands[language];
        console.log("Executing command:", command); // Log the command

        if (!command) return reject(new Error("Unsupported language"));

        exec(command, { timeout: 10000 }, (err, stdout, stderr) => {
            if (err) {
                console.error("Execution error:", stderr || err.message);
                return reject(stderr || err.message);
            }
            resolve(stdout || "Program executed successfully");
        });
    });
}


export { onCompileCodeHandler };
