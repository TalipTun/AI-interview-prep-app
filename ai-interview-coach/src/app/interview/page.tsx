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
    const [input1Text, setInput1Text] = useState("");
    const [input2Text, setInput2Text] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    

    return (
        <main ref={containerRef} className="relative flex w-screen h-screen m-0 p-2.5 bg-black box-border">
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
                            input1Text={input1Text}
                            setInput1Text={setInput1Text}
                            input2Text={input2Text}
                            setInput2Text={setInput2Text}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <div 
                            id="IDE" 
                            className="h-full w-full m-0 p-0 relative">
                                <div className="w-full"
                                    style={{ height: "calc(50% - 4px)" }}>
                                    <MonacoEdtior 
                                        language="python"
                                        currentStep={currentStep}
                                        setCurrentStep={setCurrentStep}
                                        code={code}
                                        setCode={setCode}
                                    /> 
                                </div>

                                <div id="dividerBar" className="h-2 w-full bg-black">

                                </div>

                                <div className="w-full"
                                    style={{ height: "calc(50% - 4px)" }}>
                                    <InputField
                                    currentStep={currentStep}
                                    setCurrentStep={setCurrentStep}
                                    dockerApiResponse={dockerApiResponse}
                                    setDockerApiResponse={setDockerApiResponse}
                                    code={code}
                                    setCode={setCode}
                                    input1Text={input1Text}
                                    setInput1Text={setInput1Text}
                                    input2Text={input2Text}
                                    setInput2Text={setInput2Text}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    />
                                </div>
                        </div>
                    </>
                )}
            </div>

            {/* isLoading && */ (
            <div
                id="loadAction"
                className="
                    fixed inset-0       /* Covers entire viewport */
                    bg-black/70         /* Semi-transparent dark background */
                    z-[999]             /* High z-index to be on top of everything */
                    flex items-center justify-center /* Centers its content (the text) */
                    text-3xl text-accent /* Styles for the text */
                "
            >
                <div className="
                    p-8 rounded-lg      /* Padding and rounded corners for the box around text */
                    bg-[#292929]        /* Your panel background color */
                    border-2 border-accent /* Your accent border */
                    text-white          /* Text color inside the box */
                    flex items-center justify-center /* To center text if it wraps */
                    shadow-lg           /* Optional: Add a subtle shadow */
                ">
                    Generating Feedback...
                </div>
            </div>
        )}
        </main>
    )
}