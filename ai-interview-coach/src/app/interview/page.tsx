'use client';
import { useRef, useEffect, useState } from "react"
import dynamic from "next/dynamic";

const MonacoEdtior = dynamic( () => import("../components/MonacoEditor"), {
    ssr: false,
} )

export default function Page() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [leftWidth, setLeftWidth] = useState(0);
    const [rightWidth, setRightWidth] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    //this code makes two sides split equally in the beginning, on mount.
    useEffect(() => {
        if (containerRef.current) {
            const totalWidth = containerRef.current.offsetWidth;
            setLeftWidth(totalWidth / 2);
            setRightWidth(totalWidth / 2);
        }
    }, [])

    function mouseDown() {
        setIsDragging(true);
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    }

    const mouseMove = (e : MouseEvent) => {
        if (containerRef.current == null) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const xDiff = e.clientX - containerRect.left
        const min = 200;

        const newLeftWidth = Math.max(min, Math.min(xDiff, containerRect.right - min));
        const newRightWidth = containerRect.width - newLeftWidth - 2;

        setLeftWidth(newLeftWidth);
        setRightWidth(newRightWidth);
    }

    
    function mouseUp() {
        setIsDragging(false);
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    }

    return (
        <main ref={containerRef} className="flex w-screen h-screen border-4 m-0 p-0 bg-black">

            <div 
                id="leftPane" 
                style={ {width : leftWidth + "px" }} 
                className="bg-background h-screen w-50">
            </div>

            <div 
                id="resizeableBar" 
                onMouseDown={mouseDown} 
                className="h-screen w-2 bg-black cursor-ew-resize">
            </div>

            <div 
                id="rightPane" 
                style={ {width : rightWidth + "px" }} 
                className="h-screen flex-1 max-h-screen p-0">

                <textarea 
                    style={{height: 24 + "vh"}} 
                    className=" w-full bg-background resize-none m-0 p-0" 
                    placeholder="Explain your understanding of the problem...">

                <button className="w-10 h-10"> Run Code </button>
                </textarea>

                <div 
                    className="w-full h-0.5 bg-black">
                </div>

                <div 
                    id="IDE" 
                    className="h-2/4 w-full bg-background m-0 p-0 ">
                        <MonacoEdtior language="python"/>
                </div>


                <div 
                    className="w-full h-2 bg-black">
                </div>

                <textarea 
                    style={{height: 24 + "vh"}} 
                    className=" w-full bg-background resize-none" 
                    placeholder="Explain your solution code for the problem...">                   
                </textarea>
            </div>
        </main>
)
}