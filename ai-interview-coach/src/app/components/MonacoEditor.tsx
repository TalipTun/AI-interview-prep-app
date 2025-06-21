'use client'

import Editor from "@monaco-editor/react";
import { useState, useRef } from "react";

type MonacoEdtiorProps = {
    language?: string;
};

export default function MonacoEdtior( {
    language = "python",
}: MonacoEdtiorProps) {

    const [code, setCode] = useState("");

    function handleChange(val: string | undefined) {
        const newCode = val;
        setCode(val ?? "");
    }

    return (
        <Editor
            defaultValue=""
            language={language}
            theme="vs-dark"
            options={{ fontSize: 14, minimap: { enabled: false }, lineNumbers: 'on' }}
            onChange={handleChange}
        />
    )
}