import { useRef, useEffect, useState, use } from "react"

interface ResizableBarProps {
    leftWidth: number;
    setLeftWidth: React.Dispatch<React.SetStateAction<number>>;
    rightWidth: number;
    setRightWidth: React.Dispatch<React.SetStateAction<number>>;
    containerRef: React.RefObject<HTMLDivElement | null>; // Allow null
}

const ResizeableBar: React.FC<ResizableBarProps> = ( {
    leftWidth,
    setLeftWidth,
    rightWidth,
    setRightWidth,
    containerRef
} ) => {

    const [isDragging, setIsDragging] = useState(false); 
    
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
        <div 
            id="resizeableBar" 
            onMouseDown={mouseDown} 
            className="w-2 h-screen cursor-ew-resize flex items-center justify-center">
                <div
                    style={{background: "#252525"}} 
                    className="w-0.5 h-7 rounded-4xl">
                </div>
        </div>
    )
}

export default ResizeableBar;