import { CompileFile } from "ve-compiler";

const onCompileCodeHandler = async (req, res) => {
    const { language, code } = req.body;

    if (!language || !code) {
        return res.status(400).json({ error: "Language and code are required" });
    }

    try {
        const output = await CompileFile(language, code);
        const stdout = output.stdout || '';
        
        // Ensure output has appropriate line breaks
        const formattedOutput = stdout.replace(/\n/g, '\n'); // Customize this if needed
        res.json({ message: formattedOutput });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};



export { onCompileCodeHandler };
