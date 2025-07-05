'use client'

import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

export default function ResultsPage() {
    const [feedback, setFeedback] = useState<any>(null);

    useEffect(() => {
        const interviewSessionData = localStorage.getItem("interviewSessionData");
        if (interviewSessionData) {
            setFeedback(JSON.parse(interviewSessionData));
            localStorage.removeItem("interviewSessionData");
        }

        console.log("here is your feedback: ",feedback)
    },[feedback])

    if (!feedback) {
        return <div className="text-center text-gray-500">Loading feedback or no feedback found...</div>;
    }

    return (
        <div className="p-8 text-gray-100 bg-gray-950 h-screen overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">Interview Feedback Report</h1>

            <div id='userInput' className='w-full h-fit flex flex-row mb-10'>
                <div className='w-full rounded-xl min-h-50 p-5 flex flex-col'
                    style={{backgroundColor: "#292929"}}>
                    
                    <p className='text-accent text-2xl w-full text-center mb-3'>Understanding</p>
                    {feedback.input1}
                </div>

                <div className='w-20 h-full bg-black'></div>

                <div className='w-full rounded-xl p-5 flex flex-col'
                    style={{backgroundColor: "#292929"}}>
                    
                    <p className='text-accent text-2xl w-full text-center mb-3'>Code</p>
                    {feedback.code}
                </div>

                <div className='w-20 h-full bg-black'></div>

                <div className='w-full rounded-xl p-5 flex flex-col'
                    style={{backgroundColor: "#292929"}}>
                    <p className='text-accent text-2xl w-full text-center mb-3'>Explanation</p>
                    {feedback.input2}
                </div>
            </div>

            <section className="markdown-section mb-8 p-6 rounded-lg">
                <div className="markdown-content">
                    <Markdown>{feedback.problemUnderstanding}</Markdown>
                </div>
            </section>

            <section className="markdown-section mb-8 p-6 rounded-lg">
                <div className="markdown-content">
                    <Markdown>{feedback.solutionExplanation}</Markdown>
                </div>
            </section>

            <section className="markdown-section mb-8 p-6 rounded-lg">
                <div className="markdown-content">
                    <Markdown>{feedback.codeCritique}</Markdown>
                </div>
            </section>
        </div>
    );
}