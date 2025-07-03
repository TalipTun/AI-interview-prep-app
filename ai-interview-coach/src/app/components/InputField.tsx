import React, { forwardRef, use, useRef, useState } from "react";
import microphone_icon from "../assets/microphone.png";
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
                code: `
                function getKthCharacter(k: number): string {
            // The problem states k is 1-indexed, so we convert it to 0-indexed for calculations.
            let currentK = k - 1; 

            // The length of the string after 'm' operations is 2^m.
            // We need to find which 'block' or iteration 'currentK' falls into.
            // This recursive function determines the character.
            // charOffset tracks how many times the character has been 'shifted' (a->b, b->c, etc.)
            // based on which half of the string it falls into at each step.
            
            function findCharRecursive(index: number, charOffset: number): number {
                // Base case: If the index is 0, it means we've reached the first character of a block.
                // The character is 'a' plus the accumulated charOffset.
                if (index === 0) {
                    return charOffset; // Returns the offset from 'a'
                }

                // Find the largest power of 2 that is less than or equal to the current index.
                // This represents the length of the string in the previous full iteration.
                let powerOfTwo = 1;
                while (powerOfTwo * 2 <= index) {
                    powerOfTwo *= 2;
                }

                // If the index is in the first half of the current block,
                // it belongs to the previous iteration's string. The character offset doesn't change.
                if (index < powerOfTwo) {
                    return findCharRecursive(index - powerOfTwo / 2, charOffset);
                } 
                // If the index is in the second half of the current block,
                // it belongs to the newly appended and transformed part of the string.
                // The character offset increases by 1.
                else {
                    return findCharRecursive(index - powerOfTwo, charOffset + 1);
                }
            }

            // Calculate the final offset from 'a'
            const finalOffset = findCharRecursive(currentK, 0);

            // Convert the offset back to a character, handling the 'z' to 'a' wrap-around
            const charCode = 'a'.charCodeAt(0) + (finalOffset % 26);
            return String.fromCharCode(charCode);
        }
                `,
                input1: "Okay, so I think the problem is asking us to figure out a specific character in a very long string. Alice starts with 'a'. Then, Bob keeps telling her to take the entire current word, change every character in it to the next letter (like 'a' to 'b', 'b' to 'c'), and then append this newly transformed word to the end of the original word. So, if word is 'a', the next character is 'b'. The new string is 'b'. This 'b' is appended to 'a', so word becomes 'ab'. Then for 'ab', the next characters are 'bc'. So 'bc' is appended to 'ab', making it 'abbc'. I think the string length just doubles each time, and the character at position k is determined by how many operations have happened, so it's probably just 'a' plus k or k-1 offset, wrapping around from 'z'. The 'z' wrapping to 'a' is a bit tricky, but I think the core idea is just finding the character based on its index.",
                input2: "My solution calculates the k-th character by first converting k to a 0-indexed value. Then, I use a recursive helper function findCharRecursive to determine the character. This function basically figures out which part of the string k falls into. If k is in the first half, it means the character hasn't changed. If it's in the second half, it means the character has shifted by one. This process continues until k becomes 0. The time complexity of this approach is O(k) because in the worst case, the while loop inside findCharRecursive iterates proportional to k to find the powerOfTwo. The space complexity is O(1) because I'm not storing any large data structures. The findCharRecursive function also handles the 'z' to 'a' wrap-around automatically because it uses character codes, which is a neat trick. The powerOfTwo calculation helps me figure out the exact position. The overall string length grows very quickly, but my algorithm doesn't actually build the string, which is efficient.",
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

                localStorage.setItem("interviewFeedback", JSON.stringify(result.feedback));
            } else {
                console.log("feedback request failed");
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