import { NextResponse } from "next/server";
import OpenAI  from "openai";
import fs from "fs";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("audioFile");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        console.log("received file:", file);
        console.log("API Key:", process.env.NEXT_PUBLIC_OPENAI_API_KEY);

            const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });        
            const transcription = await openai.audio.transcriptions.create({
                file: file,
                model: "gpt-4o-transcribe",
                response_format: "text",
                language: "en",
            });

        console.log("here is the transcriotion: ",transcription);
        return NextResponse.json({ transcription });
        
    } catch (err) {
        console.log("an error occured", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}