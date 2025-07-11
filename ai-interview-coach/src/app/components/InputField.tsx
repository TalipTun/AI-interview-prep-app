import React, { forwardRef, use, useRef, useState } from "react";
import microphone_icon from "../assets/microphone.png";
import Link from 'next/link'
import { useRouter } from "next/navigation";

interface InputFieldProps {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    dockerApiResponse: {
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
        } | null;
        setDockerApiResponse: React.Dispatch<React.SetStateAction<{
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
        } | null>>;
        code: string;
        setCode: React.Dispatch<React.SetStateAction<string>>;
        input1Text: string;
        setInput1Text: React.Dispatch<React.SetStateAction<string>>;
        input2Text: string;
        setInput2Text: React.Dispatch<React.SetStateAction<string>>;
        isLoading: boolean;
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}



const InputField: React.FC<InputFieldProps> = ({
        currentStep,
        setCurrentStep,
        dockerApiResponse,
        setDockerApiResponse,
        code,
        setCode,
        input1Text,
        setInput1Text,
        input2Text,
        setInput2Text,
        isLoading,
        setIsLoading,
    }) => {
        
        // Define refs locally for this component
        const inputContainerRef = useRef<HTMLTextAreaElement>(null);
        const switchButtonRef = useRef<HTMLButtonElement>(null);
        const iconRef = useRef<HTMLImageElement>(null);
        const stopButtonRef = useRef<HTMLButtonElement>(null);
        const [recording, setRecording] = useState(false);

        const constraints = {
            audio: true,
            video: false,
        };

        const mediaRecorderRef = useRef<MediaRecorder | null>(null);
        const chunks = useRef<BlobPart[]>([]);
        const [audioURL, setAudioURL] = useState<string | null>(null);
        const router = useRouter();

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
                                const blob = new Blob(chunks.current, { type: "audio/webm" });
                                chunks.current = [];
                                const audioURL = URL.createObjectURL(blob);
                                setAudioURL(audioURL);
    
                                const data = new FormData();
                                data.append("audioFile", blob, "recording.webm");
                                submitData(data);
    
                                setRecording(false);
                            };
    
                            chunks.current = [];
                            mediaRecorder.start();
                            setRecording(true);
                        });
                }
            } else {
                // Stop recording
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                    mediaRecorderRef.current.stop();
                }
            }
        }

        const input1Ref = useRef<string>("");

        const submitData = async (data: FormData) => {
            try {
                let response = await fetch("/api/transcribe", {
                    method: "POST",
                    body: data,
                });

                if (response.ok) {
                    const text = await response.json();
                    let transcription = text.transcription;

                    if (typeof transcription === "string" && transcription.startsWith("{")) {
                        transcription = JSON.parse(transcription).transcription;
                    }

                    if (currentStep === 1) {
                        input1Ref.current = transcription;
                        setInput1Text(transcription);

                    } else {
                        setInput2Text(transcription);
                    }

                } else {
                    console.error("Upload failed:", response.statusText);
                }
            } catch (err) {
                console.log("An error occurred:", err);
            }
            };

        const getFeedback = async ({ question, code, input1, input2 }: { question?: string; code?: string; input1?: string; input2?: string }) => {

            let data = {
                question: question,
                code: code,
                input1: input1,
                input2: input2,
            };
            
            let response = await fetch("/api/feedback", {
                headers: {
                    "Content-Type": "application/json",
                },

                method: "POST",
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("here is the end resly", result);

                localStorage.setItem("interviewSessionData", JSON.stringify(result));
                setIsLoading(false);
            } else {
                console.log("feedback request failed");
                setIsLoading(false);
            }
        };

        const handleSubmit = async () => {
            setIsLoading(true);

            await getFeedback({
                question: dockerApiResponse?.question,
                code: code,
                input1: input1Text,
                input2: input2Text,
            });

            setIsLoading(false);
            router.push('/results');
        }

        return (
            <div className="relative w-full h-full bg-background rounded-xl">
                {/* Textarea */}
                <textarea
                    disabled
                    className="w-full resize-none m-0 p-0 h-full"
                    ref={inputContainerRef}
                    style={{ minHeight: "100px" }}
                />
                
                {/* Record Button */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
                    { currentStep === 1 && (
                        <p className="text-white text-4xl mb-4 w-full">Explain Your Understanding of The Problem</p>
                    )}
                    { currentStep === 2 && (
                        <p className="text-white text-4xl mb-4 w-full">Explain Your Code</p>
                    )}
                    <button
                        ref={stopButtonRef}
                        className={`rounded-full p-4 transition-colors duration-300 ${
                            recording
                                ? "bg-green-500 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-green-500 hover:text-white"
                        }`}
                        type="button"
                        onClick={handleRecord}
                    >
                        <img
                            src={microphone_icon.src}
                            className="w-8 h-8"
                            style={{ filter: "invert(1)" }}
                            alt="mic"
                        />
                    </button>
                </div>
                {/* Proceed or Submit Button */}

                { currentStep === 1 && (
                    <button
                        className="absolute rounded-2xl right-0 bottom-0 h-12 w-24 bg-accent flex items-center justify-center hover:bg-blue-400 transition-colors duration-150" onClick={() => {setCurrentStep(2)}}
                    >
                        Proceed
                    </button>
                )}

                { currentStep === 2 && (
                    <button
                        className="absolute rounded-2xl right-0 bottom-0 h-12 w-24 bg-accent flex items-center justify-center hover:bg-blue-400 transition-colors duration-150"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                )}
            </div>
        );
    };

export default InputField;