'use client';
import { useRef, useEffect, useState, use } from "react"
import dynamic from "next/dynamic";
import InputField from "../components/InputField";
import ResizableBar from "../components/ResizableBar";
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
    const [currentStep, setCurrentStep] = useState(1);
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

    const [code, setCode] = useState("");

    return (
        <main ref={containerRef} className="flex w-screen h-screen m-0 p-2.5 bg-black box-border">

            <LeftPane
                leftWidth={leftWidth}
                leftPaneRef={leftPane}
                dockerApiResponse={dockerApiResponse}
                setDockerApiResponse={setDockerApiResponse}
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
                className="flex-1 max-h-screen p-0 m-0">

                {currentStep === 1 && (
                    <>
                        <InputField 
                            currentStep={currentStep}
                            setCurrentStep={setCurrentStep}
                            dockerApiResponse={dockerApiResponse}
                            setDockerApiResponse={setDockerApiResponse}
                            code={code}
                            setCode={setCode}
                        />
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <div 
                            id="IDE" 
                            className="h-full w-full m-0 p-0 relative">
                            <MonacoEdtior 
                                language="python"
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                code={code}
                                setCode={setCode}
                            /> 
                        </div>
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <InputField 
                            currentStep={currentStep}
                            setCurrentStep={setCurrentStep}
                            dockerApiResponse={dockerApiResponse}
                            setDockerApiResponse={setDockerApiResponse}
                            code={code}
                            setCode={setCode}
                        />
                    </>
                )}
            </div>
        </main>
    )
}