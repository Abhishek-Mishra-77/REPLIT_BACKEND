import { CompileFile } from "ve-compiler";

const onCompileCodeHandler = async (req, res) => {
    const { language, code } = req.body;

    if (!language || !code) {
        return res.status(400).json({ error: "Language and code are required" });
    }


    try {
        const output = await CompileFile(language, code);
        const stdout = output.stdout || '';
        res.json({ message: stdout });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};



export { onCompileCodeHandler };
