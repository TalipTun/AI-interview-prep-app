import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        let response = await fetch("http://localhost:3001/daily", {
            method: "GET"
        });

        let data = await response.json();
        return NextResponse.json(data);
    }

    catch (err) {
        console.log("an error occured:", err)
        return NextResponse.json( {error: "internal server error"}, {status: 500});
    }
}