import { CompileFile } from "ve-compiler";

const predefinedCodeTemplates = {
    javascript: 'console.log("Hello, JavaScript!");',
    python: 'print("Hello, Python!")',
    java: `
        public class Main {
            public static void main(String[] args) {
                System.out.println("Hello, Java!");
            }
        }
    `,
    c: `
        #include <stdio.h>
        int main() {
            printf("Hello, C!\\n");
            return 0;
        }
    `,
    cpp: `
        #include <iostream>
        int main() {
            std::cout << "Hello, C++!" << std::endl;
            return 0;
        }
    `,
    // Add more languages and templates as needed
};

const onCompileCodeHandler = async (req, res) => {
    const { language, code } = req.body;

    if (!language || !code) {
        return res.status(400).json({ error: "Language and code are required" });
    }

    if (!predefinedCodeTemplates[language]) {
        return res.status(400).json({ error: `Unsupported language: ${language}` });
    }

    try {
        const output = await CompileFile(language, code);
        const stdout = output.stdout || '';
        res.json({ message: stdout });
    } catch (error) {
        res.status(500).json({ error: `Compilation error: ${error.toString()}` });
    }
};

export { onCompileCodeHandler };
