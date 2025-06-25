import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("audioFile");

        if (!file) {
            return NextResponse.json( { error: "No file uploaded"}, {status: 400})
        }

        console.log("received file:", file);
        return NextResponse.json({ message: "File received successfully" });
        
    } catch (err) {
        console.log("an error occured", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}