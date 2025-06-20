'use client'

import Editor from "@monaco-editor/react";

type MonacoEdtiorProps = {
    language?: string;
    handleChange?: (value: string | undefined) => void;
};

export default function MonacoEdtior( {
    language = "python",
    handleChange
}: MonacoEdtiorProps) {
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