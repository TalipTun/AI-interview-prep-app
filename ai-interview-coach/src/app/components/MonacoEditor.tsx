'use client'

import Editor from "@monaco-editor/react";
import { useState, useRef } from "react";

type MonacoEdtiorProps = {
    language?: string;
    options?: {
        backgroundColor?: string;
    };
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function MonacoEdtior( {
    language = "python",
    options = { backgroundColor: "#1d1d1d" },
    currentStep,
    setCurrentStep,
}: MonacoEdtiorProps) {

    const [code, setCode] = useState("");

    function handleChange(val: string | undefined) {
        const newCode = val;
        setCode(val ?? "");
    }

    return (
        <>
            <Editor
                className="py-6 bg-background relative"
                value={code}
                language={language}
                theme="my-dark"
                options={{ 
                    fontSize: 14, 
                    minimap: { enabled: false }, 
                    lineNumbers: 'on', 
                }}
                onMount={(editor, monaco) => {
                    monaco.editor.defineTheme("my-dark", {
                        base: "vs-dark",
                        inherit: true,
                        rules: [],
                        colors: { 'editor.background': options.backgroundColor || '#262626' },
                    })
                    monaco.editor.setTheme("my-dark")
                }}
                onChange={handleChange}
            />
            
            <button 
                className="absolute rounded-2xl right-0 bottom-0 h-12 w-24 bg-accent flex items-center justify-center hover:bg-blue-400 transition-colors duration-150" onClick={() => setCurrentStep(currentStep + 1)}
            >
                Proceed
            </button>
        </>
    )
}