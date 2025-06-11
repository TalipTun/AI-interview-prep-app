'use client';
import { useRef, useEffect, useState } from "react"

export default function Page() {
    const [leftPaneWidth, setLeftPaneWidth] = useState(100);
    let prevX = 0;
    let currX = 0;

    function handleDrag() {
        setLeftPaneWidth(600);
        var diff = currX - prevX;
        setLeftPaneWidth(100 + diff);
    }

    function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
        prevX = event.clientX;
        console.log("Mouse down on:", prevX);
    }

    function handleMouseUp(event: React.MouseEvent<HTMLDivElement>) {
        currX = event.clientX;
        console.log("Mouse up on:", currX);
    }

    return (
    <main className="flex h-screen m-0 p-0">
        <div style={ {width: leftPaneWidth + "px"} }  className="bg-background h-full overflow-auto resize-x">

        </div>

        <div onClick={handleDrag} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} className="h-full w-2 bg-amber-700 cursor-ew-resize"></div>

        <div className="bg-accent h-full flex-1">

        </div>
    </main>
)
}