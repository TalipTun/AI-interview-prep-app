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
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
};

export default function MonacoEdtior( {
    language = "python",
    options = { backgroundColor: "#1d1d1d" },
    currentStep,
    setCurrentStep,
    code,
    setCode,
}: MonacoEdtiorProps) {

    function handleChange(val: string | undefined) {
        const newCode = val;
        setCode(val ?? "");
    }

    return (
        <div className="h-full w-full">
            <Editor
                className="py-6 bg-background relative rounded-xl h-full"
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
        </div>
    )
}