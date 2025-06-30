'use client';
import { useRef, useEffect, useState, use } from "react"
import dynamic from "next/dynamic";
import InputField from "../components/InputField";
import ResizableBar from "../components/resizableBar";
import LeftPane from "../components/LeftPane";
import "../../app/globals.css";

const MonacoEdtior = dynamic( () => import("../components/MonacoEditor"), {
    ssr: false,
} )

export default function Page() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [leftWidth, setLeftWidth] = useState(0);
    const [rightWidth, setRightWidth] = useState(0);
    const leftPane = useRef<HTMLDivElement>(null);

    return (
        <main ref={containerRef} className="flex w-screen h-screen m-0 p-2.5 bg-black box-border">

            <LeftPane
                leftWidth={leftWidth}
                leftPaneRef={leftPane}
            />

            <ResizableBar 
                leftWidth={leftWidth}
                setLeftWidth={setLeftWidth}
                rightWidth={rightWidth}
                setRightWidth={setRightWidth}
                containerRef={containerRef}
            />

            <div 
                id="rightPane" 
                style={ {width : rightWidth - 4 + "px" }} 
                className="flex-1 h-screen p-0 m-0">

                <InputField />

                <div 
                    id="IDE" 
                    className="h-2/4 w-full m-0 p-0 relative">
                    <MonacoEdtior language="python"/> 
                </div>

                <InputField />
            </div>
        </main>
    )
}