import React, { useRef, useState } from "react";
import microphone_icon from "../assets/microphone.png";
import keyboard_icon from "../assets/keyboard.png";
import microphone_small_icon from "../assets/microphone_small.png"

export default function InputField() {
    const input1_container = useRef<HTMLTextAreaElement>(null);
    const switchButton = useRef<HTMLButtonElement>(null);
    const icon = useRef<HTMLImageElement>(null);
    const stopBtn = useRef<HTMLButtonElement>(null);
    const [recording, setRecording] = useState(false);

    const constraints = {
        audio: true,
        video: false,
    }
    
    const submitData = async (data: FormData) => {
        try {
            let response = await fetch("/api/transcribe",  {
                method: "POST",
                body: data
            })
    
            if (response.ok) {
                // this is where we have the text
                const text = await response.json();
                
                let transcription = text.transcription;
                if (typeof transcription === "string" && transcription.startsWith("{")) {
                    transcription = JSON.parse(transcription).transcription;
                }
    
    
                if (input1_container.current && stopBtn.current) {
                    input1_container.current.value = transcription;
                    stopBtn.current.style.display = "none";
                    input1_container.current.disabled = false;
                }
            } else {
                console.error("Upload failed:", response.statusText);
            }
        } catch (err) {
            console.log("an error occured:", err);
        }
    }
    
    // Define chunks outside so it's accessible
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<BlobPart[]>([]);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const data = new FormData();
    
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
    
                            console.log("recorder stopped");
                            setRecording(false);
                        };
    
                        chunks.current = [];
                        mediaRecorder.start();
                        setRecording(true);
                        console.log("recorder started");
                        if (switchButton.current) {
                            switchButton.current.style.display = "none";
                        }
                    });
            }
        } else {
            // Stop recording
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
            }
        }
    };
    
    const handleSwitchButton = () => {
        // if textare is enabled
        if (stopBtn.current && input1_container.current && switchButton.current && icon.current && stopBtn.current.style.display === "block") {
            stopBtn.current.style.display = "none";
            input1_container.current.disabled = false;
            icon.current.src = microphone_small_icon.src;
        } else if (stopBtn.current && input1_container.current && switchButton.current && icon.current && stopBtn.current.style.display === "none") {
            stopBtn.current.style.display = "block";
            input1_container.current.disabled = true;
            icon.current.src = keyboard_icon.src;
            input1_container.current.value = "";
        }
    }    

    return (
        <div className="relative w-full h-24/100 bg-background">
            <textarea
                disabled
                id="input1"
                className="w-full resize-none m-0 p-0 h-full"
                ref={input1_container}
                style={{ minHeight: "100px" }}
            />
            <button
                style={ {display: "block"} }
                id="record"
                ref={stopBtn}
                className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 transition-colors duration-300 ${
                    recording
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-green-500 hover:text-white'
                }`}
                // onClick={handleRecord}
                type="button"
            >
                <img src={ microphone_icon.src} className="w-8 h-8" style={{ filter: "invert(1)" }} alt="mic" />
            </button>

            <button ref={switchButton} style={ {display: "flex"} } className="absolute rounded-2xl right-0 top-0 h-12 w-12 bg-gray-700 flex items-center justify-center hover:bg-green-500 transition-colors duration-300" onClick={handleSwitchButton}>
                <img ref={icon} className="w-6 h-6 m-0 p-0" src={keyboard_icon.src} style={{ filter: "invert(1)" }}></img>
            </button>
        </div>
    )
};