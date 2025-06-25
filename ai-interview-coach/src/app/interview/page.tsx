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
    const recordBtn = useRef<HTMLButtonElement>(null);
    const stopBtn = useRef<HTMLButtonElement>(null);
    const [recording, setRecording] = useState(false);

    //this code makes two sides split equally in the beginning, on mount.
    useEffect(() => {
        if (containerRef.current) {
            const totalWidth = containerRef.current.offsetWidth;
            setLeftWidth(totalWidth / 2);
            setRightWidth(totalWidth / 2);
        }

        //put these here because of ssr, works on mount
        
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

    const constraints = {
        audio: true,
        video: false,
    }

    // Define chunks outside so it's accessible
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<BlobPart[]>([]);
    const [audioURL, setAudioURL] = useState<string | null>(null);

    const handleRecord = () => {
        if (!recording) {
            // Start recording
            if (navigator.mediaDevices) {
                navigator.mediaDevices
                    .getUserMedia(constraints)
                    .then((stream) => {
                        const mediaRecorder = new MediaRecorder(stream);
                        mediaRecorderRef.current = mediaRecorder;

                        mediaRecorder.ondataavailable = (e) => {
                            chunks.current.push(e.data);
                        };

                        mediaRecorder.onstop = () => {
                            const blob = new Blob(chunks.current, { type: "audio/ogg; codecs=opus" });
                            chunks.current = [];
                            const audioURL = URL.createObjectURL(blob);
                            setAudioURL(audioURL);

                            console.log("recorder stopped");
                            setRecording(false);
                        };

                        chunks.current = [];
                        mediaRecorder.start();
                        setRecording(true);
                        console.log("recorder started");
                    });
            }
        } else {
            // Stop recording
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
        }
};

    return (
        <main ref={containerRef} className="flex w-screen h-screen border-4 m-0 p-0 bg-black">

            <div 
                id="leftPane" 
                style={ {width : leftWidth - 4 + "px" }} 
                className="bg-background h-screen">
            </div>

            <div 
                id="resizeableBar" 
                onMouseDown={mouseDown} 
                className="h-screen w-2 bg-black cursor-ew-resize">
            </div>

            <div 
                id="rightPane" 
                style={ {width : rightWidth - 4 + "px" }} 
                className="h-screen flex-1 max-h-screen p-0">

                <div
                    id="input1"
                    className="w-full bg-background resize-none m-0 p-0 h-24/100 flex flex-row justify-center items-center">
                        <button id="record" className="w-24 h-8 bg-accent" ref={recordBtn} onClick={handleRecord}> Record </button>
                        {audioURL && (<audio controls src={audioURL} className="mt-4" />)}
                </div>

                <div 
                    className="w-full h-0.5 bg-black">
                </div>

                <div 
                    id="IDE" 
                    className="h-2/4 w-full m-0 p-0 relative">
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