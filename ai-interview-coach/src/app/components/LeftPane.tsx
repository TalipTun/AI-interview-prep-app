import React, { useEffect, useRef, useState } from "react";

interface LeftPaneProps {
    leftWidth: number;
    leftPaneRef: React.RefObject<HTMLDivElement | null>;
}

const LeftPane: React.FC<LeftPaneProps> = ( {leftWidth, leftPaneRef} ) => {
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
    }, []);

    return (
        <div
                id="leftPane"
                style={{ width: leftWidth - 4 + "px" }}
                className="bg-background max-h-screen overflow-y-auto p-4 text-white border-1 border-border rounded-xl"
                ref={leftPaneRef}
            >
                Question: 

                {dockerApiResponse ? (
                    <div
                        dangerouslySetInnerHTML={{ __html: dockerApiResponse.question }}
                        className="problem-container prose prose-invert max-w-none"
                    ></div>
                ) : (
                    <p className="text-gray-400">Loading...</p>
                )}
            </div>
    );
};

export default LeftPane;