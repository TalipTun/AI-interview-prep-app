import React, { forwardRef, use, useRef, useState } from "react";
import microphone_icon from "../assets/microphone.png";
import keyboard_icon from "../assets/keyboard.png";
import microphone_small_icon from "../assets/microphone_small.png"
import Link from 'next/link'

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
                        getFeedback({
                            question: dockerApiResponse?.question,
                            code: code,
                            input1: input1Text,
                            input2: transcription,
                        });
                    }

                    if (inputContainerRef.current && stopButtonRef.current) {
                        inputContainerRef.current.value = transcription;
                        stopButtonRef.current.style.display = "none";
                        inputContainerRef.current.disabled = false;
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

            console.log("here is the end resly", await response.json())
        };
    

        const handleSwitchButton = () => {
            if (
                stopButtonRef.current &&
                inputContainerRef.current &&
                switchButtonRef.current &&
                iconRef.current &&
                stopButtonRef.current.style.display === "block"
            ) {
                stopButtonRef.current.style.display = "none";
                inputContainerRef.current.disabled = false;
                iconRef.current.src = microphone_small_icon.src;
            } else if (
                stopButtonRef.current &&
                inputContainerRef.current &&
                switchButtonRef.current &&
                iconRef.current &&
                stopButtonRef.current.style.display === "none"
            ) {
                stopButtonRef.current.style.display = "block";
                inputContainerRef.current.disabled = true;
                iconRef.current.src = keyboard_icon.src;
                inputContainerRef.current.value = "";
            }
        };


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
                <button
                    style={{ display: "block" }}
                    ref={stopButtonRef}
                    className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 transition-colors duration-300 ${
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

                {/* Switch Button */}
                <button
                    ref={switchButtonRef}
                    style={{ display: "flex", background: "#868686" }}
                    className="absolute rounded-xl right-0 top-0 h-12 w-12 flex items-center justify-center hover:bg-green-500 transition-colors duration-300"
                    onClick={handleSwitchButton}
                >
                    <img
                        ref={iconRef}
                        className="w-6 h-6 m-0 p-0"
                        src={keyboard_icon.src}
                        style={{ filter: "invert(1)" }}
                        alt="keyboard"
                    />
                </button>

                {/* Proceed or Submit Button */}

                { currentStep === 1 && (
                    <button
                        className="absolute rounded-2xl right-0 bottom-0 h-12 w-24 bg-accent flex items-center justify-center hover:bg-blue-400 transition-colors duration-150" onClick={() => {setCurrentStep(2)}}
                    >
                        Proceed
                    </button>
                )}

                { currentStep === 3 && (
                    <Link
                        className="absolute rounded-2xl right-0 bottom-0 h-12 w-24 bg-accent flex items-center justify-center hover:bg-blue-400 transition-colors duration-150"
                        href="/results"
                    >
                        Submit
                    </Link>
                )}
            </div>
        );
    };

export default InputField;