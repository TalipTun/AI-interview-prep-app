import "./globals.css";
import Link from 'next/link'

export default function Home() {
  return (
    <main className="bg-background h-screen w-full flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center text-center gap-y-4">
        <p className="text-5xl text-primary font-extrabold">Master your Technical Interviews</p>
        <p className="text-secondary text-xl">Get instant, AI-powered feedback on your problem undestanding, solution code, and explanations</p>
        <Link href="/interview" className="bg-accent text-xl text-white flex flex-col justify-center items-center py-4 px-10 rounded-xl"> Begin Practice </Link>
      </div>
    </main>
  );
}
