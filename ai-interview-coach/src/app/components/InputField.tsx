import React, { forwardRef, useRef, useState } from "react";
import microphone_icon from "../assets/microphone.png";
import keyboard_icon from "../assets/keyboard.png";
import microphone_small_icon from "../assets/microphone_small.png"

const InputField: React.FC = () => {
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
        <div className="relative w-full h-24/100 bg-background">
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
                style={{ display: "flex" }}
                className="absolute rounded-2xl right-0 top-0 h-12 w-12 bg-gray-700 flex items-center justify-center hover:bg-green-500 transition-colors duration-300"
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
        </div>
    );
};

export default InputField;