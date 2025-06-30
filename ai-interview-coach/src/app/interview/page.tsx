'use client';
import { useRef, useEffect, useState, use } from "react"
import dynamic from "next/dynamic";
import InputField from "../components/InputField";
import ResizableBar from "../components/resizableBar";
import "../../app/globals.css";

const MonacoEdtior = dynamic( () => import("../components/MonacoEditor"), {
    ssr: false,
} )

export default function Page() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [leftWidth, setLeftWidth] = useState(0);
    const [rightWidth, setRightWidth] = useState(0);
    const leftPane = useRef<HTMLDivElement>(null);
    const [dockerApiResponse, setDockerApiResponse] = useState<{
        questionLink: string;
        date: string;
        questionId: string;
        questionFrontendId: string;
        questionTitle: string;
        titleSlug: string;
        difficulty: string;
        isPaidOnly: boolean;
        question: string;
        exampleTestcases: string;
        topicTags: { name: string; slug: string; translatedName: string | null }[];
        hints: string[];
        solution: {
            id: string;
            canSeeDetail: boolean;
            paidOnly: boolean;
            hasVideoSolution: boolean;
            paidOnlyVideo: boolean;
        };
        companyTagStats: string | null;
        likes: number;
        dislikes: number;
        similarQuestions: string;
    } | null>(null);

    const getQuestions = async () => {
        try {
            let response = await fetch("/api/leetcode-problems")

            if (response.ok) {
                const data = await response.json();
                console.log(data.question);

                setDockerApiResponse(data);
            } else {
                console.error("Upload failed:", response.statusText);
            }
        }
        catch (err) {
            console.log("An error occurred:", err);
        }
    }

    useEffect( () => {
        getQuestions();
    }, [])

    return (
        <main ref={containerRef} className="flex w-screen h-screen border-4 m-0 p-0 bg-black">

            <div
                id="leftPane"
                style={{ width: leftWidth - 4 + "px" }}
                className="bg-background h-screen overflow-y-auto p-4 text-white"
                ref={leftPane}
            >
                {dockerApiResponse ? (
                    <div
                        dangerouslySetInnerHTML={{ __html: dockerApiResponse.question }}
                        className="prose prose-invert max-w-none"
                    ></div>
                ) : (
                    <p className="text-gray-400">Loading...</p>
                )}
            </div>

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
                className="h-screen flex-1 max-h-screen p-0">

                <InputField />

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

                <InputField />
            </div>
        </main>
    )
}