'use client';
import { useRef, useEffect, useState } from "react"

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
        <main ref={containerRef} className="flex w-screen h-screen border-4 border-e-accent">
            <div id="leftPane" style={ {width : leftWidth + "px" }} className="bg-background h-full w-50">

            </div>

            <div id="resizeableBar" onMouseDown={mouseDown} className="h-full w-2 bg-amber-700 cursor-ew-resize"></div>

            <div id="rightPane" style={ {width : rightWidth + "px" }} className="bg-accent h-full flex-1 max-h-screen">

                <textarea className="h-1/4 w-full bg-amber-500" placeholder="Explain your understanding of the problem..."></textarea>

                <div id="IDE" className="h-1/2 w-full bg-amber-900"></div>

                <textarea className="h-1/4 w-full bg-amber-500" placeholder="Explain your solution code for the problem..."></textarea>

            </div>
        </main>
)
}